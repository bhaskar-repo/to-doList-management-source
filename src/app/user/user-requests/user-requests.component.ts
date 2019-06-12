import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { GlobalConfig } from 'src/app/globalConfig';
import { UserSocketService } from '../user-socket.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  private userName = Cookie.get('userName');
  private userInfo: any;
  private requests = [];

  constructor(private _sharedModuleService: SharedModuleService, private _global: GlobalService,
    private _userSocketService: UserSocketService, private _toastr: ToastrService, private _userService: UserService,
    private _router: Router) { }

  ngOnInit() {
    this.userInfo = this._userService.getFromLocalStorage();
    this.getRequests();
    this.onSendUserRequest();
    this.onCancelUserRequest();
  }

  onCancelUserRequest = () => {
    this._userSocketService.onCancelUserRequest().subscribe(
      (userId) => {
        let index = this.requests.findIndex(request => request.userId === userId);
        this.requests.splice(index, 1);
      }
    )
  }// event to be listen when user cancels the request

  public onSendUserRequest = () => {
    this._userSocketService.onSendUserRequest().subscribe(
      (data) => {
        this.requests.push(data);
      }
    )
  }

  /**
  * @description fetch requests
  * @author Bhaskar Pawar
  */
  public getRequests = () => {
    this._sharedModuleService.getRequests(Cookie.get('userId')).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.requests = apiResponse.data;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get requests

  public acceptFriendRequest = (request: any) => {
    let data = {
      senderId: request.userId,
      senderName: request.userName,
      senderCountry: request.countryName,
      receiverId: Cookie.get('userId'),
      receiverName: Cookie.get('userName'),
      receiverCountry: this.userInfo.countryName
    }
    this._sharedModuleService.acceptFriendRequest(data).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._userSocketService.emitAcceptRequest(apiResponse.data);
          setTimeout(() => {
            this._userSocketService.emitAcceptRequest(data);
          }, 500);
          setTimeout(() => {
            this._router.navigate([`/${GlobalConfig.apiVersion}/users`, Cookie.get('userId'), 'friends']);
          }, 500);
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }

  /**
   * @description deletes the user request
   * @author Bhaskar Pawar
   */
  public cancelFriendRequest = (request: any) => {
    let data = {
      userId: request.userId
    }
    this._sharedModuleService.cancelUserRequest(data).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          setTimeout(() => {
            this._userSocketService.emitCancelRequest(request.userId);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of cancel friend request


}
