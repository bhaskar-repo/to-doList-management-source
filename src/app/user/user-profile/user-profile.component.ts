import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConfig } from 'src/app/globalConfig';
import { UserSocketService } from '../user-socket.service';
import { Location } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private userName = Cookie.get('userName');
  private fullName = "Bhaskar";
  private currentUser: any;
  private requests = [];
  private friends = [];
  private isRequestSent: boolean = false;
  private isRequestReceived: boolean = false;
  private isAlreadyFriend: boolean = false;
  private isCurrentUserProfile = true;
  private userInfo:any;

  constructor(private _sharedModuleService: SharedModuleService, private _global: GlobalService, private _location: Location,
    private toastr: ToastrService, private _route: ActivatedRoute, private _router: Router, private _userSocketService: UserSocketService, 
    private _userService: UserService) { }

  ngOnInit() {
    this.getSingleUser();
    this.getFriends();
    this.getRequests();
    this.getRequestsReceived();
    this.userInfo = this._userService.getFromLocalStorage();
  }

  goBack = () => {
    this._location.back();
  }

  /**
   * @description fetch requests
   * @author Bhaskar Pawar
   */
  public getRequests = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._sharedModuleService.getRequests(userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.requests = apiResponse.data;
          this.isRequestSent = this.requests.some(request => request.userId === Cookie.get('userId'));
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get requests

  /**
   * @description fetch requests
   * @author Bhaskar Pawar
   */
  public getRequestsReceived = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._sharedModuleService.getRequests(Cookie.get('userId')).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.requests = apiResponse.data;
          this.isRequestReceived = this.requests.some(request => request.userId === userId);
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get requests


  /**
  * @description fetch friends
  * @author Bhaskar Pawar
  */
  public getFriends = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._sharedModuleService.getFriends(Cookie.get('userId')).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.friends = apiResponse.data;
          this.isAlreadyFriend = this.friends.some(friend => friend.userId === userId);
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get friends

  /**
   * 
   */
  public getSingleUser = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    if (userId === Cookie.get('userId')) {
      this.isCurrentUserProfile = false;
    }
    this._sharedModuleService.getSingleUser(userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.currentUser = apiResponse.data;
          console.log(this.currentUser);
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }

  public updateSentRequest = () => {
    let data = {
      userId: Cookie.get('userId'),
      userName: Cookie.get('userName'),
      countryName: this.userInfo.countryName,
      receiverId: this.currentUser.userId,
      receiverName: this.currentUser.fullName
    }
    this._sharedModuleService.updateSentRequest(data, this.currentUser.userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.toastr.success(`${apiResponse.message}`, "Success !");
          setTimeout(() => {
            this._userSocketService.emitSendUserRequest(data);
            this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), 'all']);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }

}
