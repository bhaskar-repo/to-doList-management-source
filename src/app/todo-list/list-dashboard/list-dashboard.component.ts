import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../todo-list.service';
import { GlobalService } from 'src/app/global.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GlobalConfig } from 'src/app/globalConfig';
import { ToastrService } from 'ngx-toastr';
import { TodoListSocketService } from '../todo-list-socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { UserSocketService } from 'src/app/user/user-socket.service';
import { MatDialog } from '@angular/material';
import { NotificationDialogComponent } from 'src/app/shared/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.css']
})
export class ListDashboardComponent implements OnInit {

  private toDolists = [];
  public scrollToListTop: boolean = true;
  private title: String;
  private selectedListObj: any;
  private createListBtnFlg: boolean = false;
  private userName = Cookie.get('userName');
  private friends = [];

  constructor(private _todoListService: TodoListService, private _global: GlobalService, private _route: ActivatedRoute
    , private _toastr: ToastrService, private _todoSocketService: TodoListSocketService, private _router: Router, private _sharedModuleService: SharedModuleService
    , private _userSocketService: UserSocketService, private _dialog: MatDialog) { }

  ngOnInit() {
    this.getAllLists();
    this.verifyUserConfirmation();
    this.updateList();
    this.onDeleteList();
    this.onNotifyListOperations();

  }

  onCreateNewList = () => {
    this.title = "";
  }

  selectedList = (listObj) => {
    this.selectedListObj = listObj;
  }

  navigateToEditList = (listId: any) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), listId, 'edit']);
  }

  navigateToViewItem = (listId: any, itemId: any) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), listId, itemId, 'view']);
  }
  /**
   * @description this is to fetch all the  lists from the database
   * @author Bhaskar Pawar
   */
  public getAllLists = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    if (Cookie.get('userId') === userId) {
      this.createListBtnFlg = false;
    }
    else {
      this.createListBtnFlg = true;
    }
    this._todoListService.getAllLists(userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.toDolists = apiResponse.data;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }

  public verifyUserConfirmation = (): any => {
    this._todoSocketService.verifyUser()
      .subscribe((data) => {
        let userDetails = {
          authToken: Cookie.get('authToken'),
          room: Cookie.get('userId') + 'request'
        }
        this._todoSocketService.setUser(userDetails);
       
      });
  }//end of verify user confirmation


  public updateList = () => {
    this._todoSocketService.updateList().subscribe((data) => {
      this.toDolists.push(data);
    })
  }// rnd of update list

  public onNotifyListOperations = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._userSocketService.onNotifyListOperation().subscribe((actionData) => {
      let message = "";
      switch (actionData.actionType) {
        case 'listcreated':
          message = `new list <b>${actionData.data.title}</b> has been created by <b>${actionData.userName}</b>`
          break;
        case 'listdeleted': 
         message = `list <b>${actionData.data.title}</b> has been deleted by <b>${actionData.userName}</b>`
          break
        default:
          break;
      }
      this._dialog.open(NotificationDialogComponent, {
        width: '250px',
        data: message
      })
    })
  }

  public onDeleteList = () => {
    this._todoSocketService.onDeleteList().subscribe((data) => {
      let removeIndex = this.toDolists.findIndex(list => list.id === data.id);
      this.toDolists.splice(removeIndex, 1);
    })
  }//end of on delete list

  /**
   * @description will add list to DB
   * @author Bhaskar Pawar
   */
  public createNewList = () => {
    let newListData = {
      title: this.title,
      owner: Cookie.get('userId')
    }
    this._todoListService.createNewList(newListData).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._toastr.success(apiResponse.message, "Success !");
          setTimeout(() => {
            let data = {
              isUndo: false,
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              actionType: 'listcreated',
              data: apiResponse.data
            }
            this._todoSocketService.emitCreateNewList(data);
          }, 1000)
          this.scrollToListTop = false;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }//end of createNewList

  /**
   * @description will delete the users list from DB
   * @author Bhaskar Pawar
   * @param {object} listObj
   * @returns {object} deleted list object
   */
  public deleteList = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._todoListService.deleteList(userId, this.selectedListObj).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._toastr.success(`${apiResponse.message}`, "Success !");
          setTimeout(() => {
            let data = {
              isUndo: false,
              userId: Cookie.get('userId'),
              userName: Cookie.get('userName'),
              actionType: 'listdeleted',
              data: this.selectedListObj
            }
            this._todoSocketService.emitDeleteList(data);
          }, 1000);

          this.scrollToListTop = true;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }//end of delete list

}
