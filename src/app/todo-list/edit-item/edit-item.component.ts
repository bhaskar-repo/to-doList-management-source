import { Component, OnInit } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConfig } from 'src/app/globalConfig';
import { GlobalService } from 'src/app/global.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TodoListService } from '../todo-list.service';
import { TodoListSocketService } from '../todo-list-socket.service';
import { MatDialog } from '@angular/material';
import { UserSocketService } from 'src/app/user/user-socket.service';
import { NotificationDialogComponent } from 'src/app/shared/notification-dialog/notification-dialog.component';
import { TodolistValidationService } from '../todolist-validation.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  private currentItem: any;
  private subItemTitle: string;
  private scrollSubItemToTop: boolean = true;
  private isDone: boolean = false;
  private min = new Date();
  private oldvalues: any;
  private userName = Cookie.get('userName');
  private newFileName: any;

  uploader: FileUploader;

  constructor(private _todoListService: TodoListService,
    private _route: ActivatedRoute, private _location: Location, private _global: GlobalService,
    private _dialog: MatDialog, private _userSocketService: UserSocketService, private _toDoListValidationService: TodolistValidationService,
    private _toastr: ToastrService, private _router: Router, private _todoSocketService: TodoListSocketService) { 
    let listId = this._route.snapshot.paramMap.get('listId');
    let userId = this._route.snapshot.paramMap.get('userId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    this.uploader = new FileUploader({url: `${GlobalConfig.serverUrl}/${GlobalConfig.apiVersion}/lists/${userId}/${listId}/${itemId}/upload?authToken=${Cookie.get('authToken')}`});
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any): any => {
        let fileData = JSON.parse(response);
        this.currentItem.fileLocation = fileData.data.fileLocation;
        this.currentItem.fileName = fileData.data.fileName;
      }
    }

  ngOnInit() {
    this.getSingleItem();
    this.onUpdateSubItemToItemsList();
    this.onDeleteSubItemFromItemsList();
    this.onMarkDoneSubItem();
    this.onNotifySubItemOperation();
    this.onNotifyItemEdited();
   
  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
    });
  }

  public goBack = () => {
    this._location.back();
  }//end of go back

  public onAddSubItemBtn = () => {
    this.subItemTitle = "";
  }

  public onUpdateSubItemToItemsList = () => {
    this._todoSocketService.onUpdateAddedSubItemItemsList().subscribe(
      (data) => {
        this.currentItem.subitemsList.push(data);
      })
  }//end of on update sub item to items list

  public onDeleteSubItemFromItemsList = () => {
    this._todoSocketService.onDeleteSubItemFromItemsList().subscribe((data) => {
      let index = this.currentItem.subitemsList.findIndex(subItem => subItem.subItemId === data.subItemId)
      this.currentItem.subitemsList.splice(index, 1);
    })
  }//end of on delete item from list

  public onMarkDoneSubItem = () => {
    this._todoSocketService.onMarkDoneSubItem().subscribe((data) => {
      let subItem = this.currentItem.subitemsList.find(subItem => subItem.subItemId === data.subItemId)
      subItem.isDone = data.isDone;
    })
  }//end of on delete item from list

  public onNotifySubItemOperation = () => {
    this._userSocketService.onNotifySubItemOperation().subscribe((actionData) => {
      let message = "";
      switch (actionData.actionType) {
        case 'subitemadded':
          message = `new sub item <b>${actionData.data.title}</b> to Item <b>${actionData.itemName}</b> has been added by <b>${actionData.userName}</b>`
          break;

        case 'subitemdeleted':
          message = `sub item <b>${actionData.data.title}</b> from Item <b>${actionData.itemName}</b> has been deleted by <b>${actionData.userName}</b>`
          break;

        case 'submarkedcomplete':
          message = `sub item <b>${actionData.data.title}</b> has been marked done of <b>${actionData.itemName}</b> by <b>${actionData.userName}</b>`
          break;
        default:
          break;
      }
      this._dialog.open(NotificationDialogComponent, {
        width: '250px',
        data: message
      })
    })
  }

  onNotifyItemEdited = () => {
    this._userSocketService.onNotifyItemEdited().subscribe(
      (data) => {
        this._dialog.open(NotificationDialogComponent, {
          width: '250px',
          data: `params <b>${data.message}</b> of item <b>${data.itemName}</b> has been updated by  <b>${data.userName}</b>`
        })
      }
    )
  }

  /**
   * @author Bhaskar Pawar
   * @description will fetch current item
   */
  public getSingleItem = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    this._todoListService.getSingleItem(userId, listId, itemId).subscribe(
      (apiResponse) => {
        this.oldvalues = {
          title: apiResponse.data.title,
          description: apiResponse.data.description,
          dueDate: apiResponse.data.dueDate,
          fileName: apiResponse.data.fileName,
          fileLocation: apiResponse.data.fileLocation
        }
        this.currentItem = apiResponse.data;
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }// end of get single Item

 uploadFile = () => {
  if (this.uploader.queue.length !== 0) {
    this.newFileName = this.uploader.queue[0].file.name;
  }
  console.log(this.oldvalues.fileName);
  console.log(this.newFileName);
  if (this.newFileName === this.oldvalues.fileName) {
    this._toastr.info('file is already present !', "Info");
    this.uploader.clearQueue();
  }
  else {
    this.uploader.queue[0].upload();
  }
 }

  /**
   * @author Bhaskar Pawar
   * @description this will edit the item to the list
   */
  public editItemInList = () => {
    let itemData = {
      title: this.currentItem.title,
      description: this.currentItem.description,
      dueDate: this.currentItem.dueDate,
      fileName: this.currentItem.fileName,
      fileLocation: this.currentItem.fileLocation
    }
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    let auditString = this._toDoListValidationService.validateIsNochanges(this.oldvalues, this.currentItem, this.newFileName);
    if (auditString === "") {
      this._toastr.info('You have no changes to save', "Info");
    }
    else {
      this._todoListService.editItemInList(userId, itemData, listId, itemId).subscribe(
        (apiResponse) => {
          if (this._global.checkResStatus(apiResponse)) {
            this._toastr.success(`${apiResponse.message}`, "Success !");
            setTimeout(() => {
              let data = {
                id: listId,
                itemId: itemId,
                isUndo: false,
                oldData: this.oldvalues,
                itemName: this.currentItem.title,
                userId: Cookie.get('userId'),
                userName: Cookie.get('userName'),
                message: auditString
              }
              this.uploader.clearQueue();
              this._todoSocketService.emitEditItemToList(data);
            }, 500);
            setTimeout(() => {
              this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, userId, 'all']);
            }, 1000)
          }
        },
        (errorMessage) => {
          this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
        })
    }
  }//end edit item to list

  /**
   * @description will add new sub item to the itemsList 
   * @author Bhaskar Pawar
   */
  public addSubItemToItemsList = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    let data = {
      title: this.subItemTitle
    }
    this._todoListService.addSubItemToItemsList(userId, data, listId, itemId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._toastr.success(`${apiResponse.message}`, "Success !");
          setTimeout(() => {
            let data = {
              id: listId,
              itemId: itemId,
              isUndo: false,
              actionType: 'subitemadded',
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              itemName: this.currentItem.title,
              data: apiResponse.data.subItem
            }
            this._todoSocketService.emitAddSubItemToItemsList(data);
          }, 1000)
          this.scrollSubItemToTop = false;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of adds ub item to items list

  /**
  * @description will delete sub item from the items list 
  * @author Bhaskar Pawar
  * @param {any} listObj
  * @param {any} itemObj
  */
  public deleteSubItemFromItemsList = (subItemObj) => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    this._todoListService.deleteSubItemFromItemsList(userId, listId, itemId, subItemObj).subscribe((apiResponse) => {
      if (this._global.checkResStatus(apiResponse)) {
        this._toastr.success(`${apiResponse.message}`, "Success !");
        setTimeout(() => {
          let data = {
            id: listId,
            itemId: itemId,
            isUndo: false,
            actionType: 'subitemdeleted',
            userId: Cookie.get('userId'),
            userName: Cookie.get('userName'),
            itemName: this.currentItem.title,
            data: subItemObj
          }
          this._todoSocketService.emitdeleteSubItemFromItemsList(data);
        }, 1000)
        this.scrollSubItemToTop = true;
      }
    },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }//end of delete sub item from the items list

  /**
   * @description will mark sub item as done
   * @author Bhaskar Pawar
   * @param {any} subItem
   */
  public markSubItemDone = (subItem: any) => {
    let data = {
      isDone: subItem.isDone
    }
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    this._todoListService.markSubItemDone(userId, data, listId, itemId, subItem.subItemId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          setTimeout(() => {
            let data = {
              id: listId,
              itemId: itemId,
              isUndo: false,
              actionType: 'submarkedcomplete',
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              itemName: this.currentItem.title,
              data: apiResponse.data
            }
            this._todoSocketService.emitMarkDoneSubItem(data);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }
}
