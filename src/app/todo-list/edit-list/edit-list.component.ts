import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../todo-list.service';
import { GlobalService } from 'src/app/global.service';
import { ToastrService } from 'ngx-toastr';
import { TodoListSocketService } from '../todo-list-socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalConfig } from 'src/app/globalConfig';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TodolistValidationService } from '../todolist-validation.service';
import { NotificationDialogComponent } from 'src/app/shared/notification-dialog/notification-dialog.component';
import { MatDialog } from '@angular/material';
import { UserSocketService } from 'src/app/user/user-socket.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {

  private currentList: any;
  private itemTitle: String;
  private scrollItemToTop: Boolean = true;
  private userName = Cookie.get('userName');

  constructor(private _todoListService: TodoListService, private _global: GlobalService, private _dialog: MatDialog,
    private _userSocketService: UserSocketService,
    private _toastr: ToastrService, private _todoSocketService: TodoListSocketService, private _route: ActivatedRoute,
    private _router: Router, private _location: Location, private _todoListValidationService: TodolistValidationService) { }

  ngOnInit() {
    this.getSingleList();
    this.onUpdateAddedItemList();
    this.onDeleteItemFromList();
    this.onMarkItemOpen();
    this.onMarkItemDone();
    this.onNotifyItemOperation();
  }

  goBack = () => {
    this._location.back();
  }

  onAddItemBtn = (list: any): void => {
    this.currentList = list;
    this.itemTitle = "";
  }//end of on add item btn

  navigateToEditItem = (listId: any, itemId: any) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), listId, itemId, 'edit']);
  }// end of navigate to edit item

  public onUpdateAddedItemList = () => {
    this._todoSocketService.onUpdateAddedItemList().subscribe((item) => {
      this.currentList.itemsList.push(item);
    })
  }//end of on update added list

  public onDeleteItemFromList = () => {
    this._todoSocketService.onDeleteItemFromList().subscribe((data) => {
      let index = this.currentList.itemsList.findIndex(item => item.itemId === data.itemId);
      this.currentList.itemsList.splice(index, 1);
    })
  }//end of on delete item from list

  public onMarkItemOpen = () => {
    this._todoSocketService.onMarkOpenItem().subscribe((data) => {
      let item = this.currentList.itemsList.find(item => item.itemId === data.itemId);
      item.isOpen = data.isOpen;
    })
  }//end of on mark open item from list

  public onMarkItemDone = () => {
    this._todoSocketService.onMarkDoneItem().subscribe((data) => {
      let item = this.currentList.itemsList.find(item => item.itemId === data.itemId);
      item.isDone = data.isDone;
    })
  }//end of on mark done item from list

  public onNotifyItemOperation = () => {
    this._userSocketService.onNotifyItemOperation().subscribe((actionData) => {
      let message = "";
      switch (actionData.actionType) {
        case 'itemadded':
          message = `new item <b>${actionData.data.title}</b> to list <b>${actionData.listName}</b> has been added by <b>${actionData.userName}</b>`
          break;

        case 'itemdeleted':
          message = `item <b>${actionData.data.title}</b> has been deleted from <b>${actionData.listName}</b> by <b>${actionData.userName}</b>`
          break;

        case 'markedopen':
          message = `item <b>${actionData.data.title}</b> has been marked open of <b>${actionData.listName}</b> by <b>${actionData.userName}</b>`
          break;
        case 'markedcomplete':
          message = `item <b>${actionData.data.title}</b> has been marked done of <b>${actionData.listName}</b> by <b>${actionData.userName}</b>`
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

  /**
   * @description will fetch single list
   * @author Bhaskaar Pawar
   */
  public getSingleList = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    this._todoListService.getSingleList(userId, listId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.currentList = apiResponse.data;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }//end of get Single List

  /**
   * @description this will add the new item to list
   * @author Bhaskar Pawar
   */
  public addItemToList = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let data = {
      title: this.itemTitle
    }
    this._todoListService.addItemToList(userId, data, listId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._toastr.success(`${apiResponse.message}`, "Success !");
          this.scrollItemToTop = false;
          setTimeout(() => {
            let data = {
              id: this.currentList.id,
              isUndo: false, 
              listName: this.currentList.title,
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              actionType: 'itemadded',
              data: apiResponse.data.item
            }
            this._todoSocketService.emitAddItemToList(data);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of add item list

  /**
  * @description will delete item from the list 
  * @author Bhaskar Pawar
  * @param {any} itemObj
  */
  public deleteItemFromList = (itemObj) => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    this._todoListService.deleteItemFromList(userId, listId, itemObj).subscribe((apiResponse) => {
      if (this._global.checkResStatus(apiResponse)) {
        this._toastr.success(`${apiResponse.message}`, "Success !");
        setTimeout(() => {
          let data = {
            id: this.currentList.id,
            isUndo: false,
            listName: this.currentList.title,
            userId: Cookie.get('userId'),
            userName: Cookie.get('userName'),
            actionType: 'itemdeleted',
            data: itemObj
          }
          this._todoSocketService.emitdeleteItemFromList(data);
        }, 1000)
        this.scrollItemToTop = true;
      }
    },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }//end of delete item from the list 

  /**
 * @description will mark item open
 * @author Bhaskar Pawar
 * @param {any} itemObj
 */
  public markItemOpen = (itemObj) => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    this._todoListService.markItemIsOpen(userId, itemObj, listId, itemObj.itemId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          setTimeout(() => {
            let data = {
              id: this.currentList.id,
              isUndo: false,
              listName: this.currentList.title,
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              actionType: 'markedopen',
              data: apiResponse.data
            }
            this._todoSocketService.emitMarkOpenItem(data);
          }, 1000);
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of mark item open

  /**
 * @description will mark item done
 * @author Bhaskar Pawar
 * @param {any} itemObj
 */
  public markItemDone = (itemObj) => {
    if (this._todoListValidationService.validateMarkDoneItem(itemObj)) {
      this._toastr.error('You have pending sub items !', "Error !");
    }
    else {
      let userId = this._route.snapshot.paramMap.get('userId');
      let listId = this._route.snapshot.paramMap.get('listId');
      this._todoListService.markItemIsDone(userId, itemObj, listId, itemObj.itemId).subscribe(
        (apiResponse) => {
          if (this._global.checkResStatus(apiResponse)) {
            setTimeout(() => {
              let data = {
                id: this.currentList.id,
                isUndo: false,
                listName: this.currentList.title,
                userId: Cookie.get('userId'),
                userName: Cookie.get('userName'),
                actionType: 'markedcomplete',
                data: apiResponse.data
              }
              this._todoSocketService.emitMarkDoneItem(data);
            }, 1000);
          }
        },
        (errorMessage) => {
          this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
        }
      )
    }
  }//end of mark item done


}
