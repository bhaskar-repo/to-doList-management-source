import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { GlobalConfig } from 'src/app/globalConfig';
import { TodoListService } from 'src/app/todo-list/todo-list.service';
import { TodoListSocketService } from 'src/app/todo-list/todo-list-socket.service';
import { UserSocketService } from '../user-socket.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  private activities = [];
  private userName = Cookie.get('userName');

  constructor(private _route: ActivatedRoute, private _sharedModuleService: SharedModuleService,
    private _global: GlobalService, private _todoListService: TodoListService, private _router: Router,
    private _todoListSocketService: TodoListSocketService, private _userSocketService: UserSocketService) { }

  ngOnInit() {
    this.getActivities();
    this.onDeleteActivity();
  }

  onDeleteActivity = () => {
    this._userSocketService.onDeleteActivity().subscribe(
      (activityId) => {
        let index = this.activities.findIndex(activity => activity.activityId === activityId);
        this.activities.splice(index, 1);
      }
    )
  }//end of on delete activity

  /**
   * @author Bhaskar Pawar
   * @description get activities from the server
   */
  public getActivities = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._sharedModuleService.getActivities(userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.activities = apiResponse.data;
          this.activities.forEach(activity => console.log(activity));
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of get activities

  public undoActivity = (activity) => {
    this.undoActions(activity);
  }

  @HostListener('window:keydown', ['$event'])
  undoOnPressControlZ = (event: KeyboardEvent) => {
    if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
      let activity = this.activities[this.activities.length - 1];
      this.undoActions(activity);
    }
  }

  undoActions = (activity) => {
    switch (activity.undoActivity) {
      case 'deletelist':
        this._todoListService.deleteList(activity.userId, activity.listData).subscribe((apiResponse) => {
          if (this._global.checkResStatus(apiResponse)) {
            let data = {
              isUndo: true,
              data: activity.listData
            }
            this._todoListSocketService.emitDeleteList(data);
          }
        })
        break;
      case 'createlist':
        this._todoListService.createNewList(activity.listData).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: apiResponse.data
              }
              this._todoListSocketService.emitCreateNewList(data);
            }
          }
        )
        break;
      case 'deleteItemFromList':
        console.log(activity.listData);
        this._todoListService.deleteItemFromList(activity.userId, activity.listData, activity.itemData).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: activity.itemData
              }
              this._todoListSocketService.emitdeleteItemFromList(data);
            }
          }
        )
        break;
      case 'addItemToList':
        this._todoListService.addItemToList(activity.userId, activity.itemData, activity.listData).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: apiResponse.data.item
              }
              this._todoListSocketService.emitAddItemToList(data);
            }
          })
        break;
      case 'markedItemOpen':
        this._todoListService.markItemIsOpen(activity.userId, activity.itemData, activity.listData, activity.itemData.itemId).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: apiResponse.data
              }
              this._todoListSocketService.emitMarkOpenItem(data);
            }
          }
        )
        break;
      case 'markedItemDone':
        this._todoListService.markItemIsDone(activity.userId, activity.itemData, activity.listData, activity.itemData.itemId).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: apiResponse.data
              }
              this._todoListSocketService.emitMarkDoneItem(data);
            }
          }
        )
        break;
      case 'markedItemClose':
        this._todoListService.markItemIsClose(activity.userId, activity.itemData, activity.listData, activity.itemData.itemId).subscribe(
          (apiResponse) => {

          }
        )
        break;
      case 'addSubItem' : 
      this._todoListService.addSubItemToItemsList(activity.userId, activity.subItemData, activity.listData, activity.itemData).subscribe(
        (apiResponse) => {
          if (this._global.checkResStatus(apiResponse)) {
            let data = {
              isUndo: true,
              data: apiResponse.data.subItem
            }
            this._todoListSocketService.emitAddSubItemToItemsList(data);
          }
        }
      )
      break;
      case 'deleteSubItem' : 
      this._todoListService.deleteSubItemFromItemsList(activity.userId, activity.listData, activity.itemData, activity.subItemData).subscribe(
        (apiResponse) => {
          if (this._global.checkResStatus(apiResponse)) {
            let data = {
              isUndo: true,
              data: activity.subItemData
            }
            this._todoListSocketService.emitdeleteItemFromList(data);
          }
        }
      )
      break;
      case 'markedSubItemDone':
        this._todoListService.markSubItemDone(activity.userId, activity.subItemData, activity.listData, activity.itemData, activity.subItemData.subItemId).subscribe(
          (apiResponse) => {
            if (this._global.checkResStatus(apiResponse)) {
              let data = {
                isUndo: true,
                data: apiResponse.data
              }
              this._todoListSocketService.emitMarkDoneSubItem(data);
            }
          }
        )
        break;
      case 'markedSubItemClose':
        this._todoListService.markSubItemClose(activity.userId, activity.subItemData, activity.listData, activity.itemData, activity.subItemData.subItemId).subscribe(
          (apiResponse) => {

          }
        )
        break;
        case 'undoEditItem' : 
        this._todoListService.editItemInList(activity.userId, activity.itemData.oldData, activity.listData, activity.itemData.itemId).subscribe(
          (apiResponse) => {

          }
        )
        break;
    }
    this._sharedModuleService.deleteActivity(activity.userId, activity.activityId).subscribe(
      (apiResponse) => {
        this._userSocketService.emitDeleteActivity(activity.activityId);
      }
    )
  }

}
