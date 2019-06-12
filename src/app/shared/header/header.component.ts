import { Component, OnInit, Input } from '@angular/core';
import { SharedModuleService } from '../shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { GlobalConfig } from 'src/app/globalConfig';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserSocketService } from 'src/app/user/user-socket.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  userName;
  firstChar;

  private requests = [];
  private friends = [];
  private activities = [];
  private requestCount: number;
  private activityCount: number;

  constructor(private _sharedModuleService: SharedModuleService, private _global: GlobalService, 
    private _userService: UserService, private _toastr: ToastrService,
    private _router: Router, private _userSocketService: UserSocketService, private _toastrService:ToastrService) { }

  ngOnInit() {
    this.firstChar = this.userName[0];
    this._userSocketService.emitJoinSocket(Cookie.get('userName'));
    this.getRequests();
    this.getFriends();
    this.getActivities();
    this.onSendUserRequest();
    this.onDecrementReqCount();
    this.onIncrementActivityCount();
    this.onAcceptUserRequest();
    this.onCancelUserRequest();
  }

  navigateToHome = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), 'all'])
  }

  navigateToUserProfile = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users`, Cookie.get('userId'), 'profile'])
  }

  navigateToUserRequests = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users`, Cookie.get('userId'), 'requests'])
  }

  navigateToFindFriends = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users`, 'find'])
  }

  navigateToFriends = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users`, Cookie.get('userId'), 'friends'])
  }

  navigateToUserActivities = () => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users`, Cookie.get('userId'), 'activities'])
  }

  public onSendUserRequest = () => {
    this._userSocketService.onSendUserRequest().subscribe(
      (data) => {
        console.log(data);
        this._toastrService.success(`${data.userName} sent you a friend request`, "Success !");
        this.requestCount++;
      }
    )
  }

  onAcceptUserRequest = () => {
    this._userSocketService.onAcceptUserRequest().subscribe(
      (data) => {
        this._toastr.success(`${data.receiverName} has accepted your friend request`);
      }
    )
  }// event to be listen when user cancels the request

  onDecrementReqCount = () => {
    this._userSocketService.onDecrementReqCount().subscribe(
      (data) => {
        this.requestCount--;
      }
    )
  }

  onIncrementActivityCount = () => {
    this._userSocketService.onIncrementActitvityCount().subscribe(
      (data) => {
        this.activityCount++;
      }
    )
  }

  onCancelUserRequest = () => {
    this._userSocketService.onCancelUserRequest().subscribe(
      (userId) => {
        this.requestCount--;
      }
    )
  }// event to be listen when user cancels the request

  /**
   * @description fetch requests
   * @author Bhaskar Pawar
   */
  public getRequests = () => {
    this._sharedModuleService.getRequests(Cookie.get('userId')).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.requests = apiResponse.data;
          this.requestCount = apiResponse.data.length;
        }
       
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get requests

   /**
   * @author Bhaskar Pawar
   * @description get activities from the server
   */
  public getActivities = () => {

    this._sharedModuleService.getActivities(Cookie.get('userId')).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          this.activities = apiResponse.data;
          this.activityCount = this.activities.length;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of get activities

  /**
  * @description fetch friends
  * @author Bhaskar Pawar
  */
 public getFriends = () => {
  this._sharedModuleService.getFriends(Cookie.get('userId')).subscribe(
    (apiResponse) => {
      if (this._global.checkResStatus(apiResponse)) {
        this.friends = apiResponse.data;
        setTimeout(() => {
          this._userSocketService.emitFriendsSocket(this.friends);
        }, 1000);
      }
    },
    (errorMessage) => {
      this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
    }
  )
}// end of get friends


  /**
   * @author Bhaskar Pawar
   * logs out the user from system and delete the cookies and localstorage
   */
  public logOut = () => {
    let userId = Cookie.get('userId');
    this._userService.logOut(userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this._toastr.success(`${apiResponse.message}`, 'Success');
        Cookie.delete('userId');
        Cookie.delete('authToken');
        Cookie.delete('userName');
        localStorage.removeItem('userInfo');

        setTimeout(() => {
          this._router.navigate(['/api/v1/users/login']);
        }, 1000)
      }
      else {
        this._toastr.error(`${apiResponse.message}`, 'Error');
      }
    })
  }//end of log out

}
