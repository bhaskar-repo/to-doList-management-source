import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSocketService } from '../user-socket.service';
import { GlobalConfig } from 'src/app/globalConfig';
import { Location } from '@angular/common';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  private userName = Cookie.get('userName');
  private friends = [];

  constructor(private _sharedModuleService: SharedModuleService, private _global: GlobalService, private _location: Location,
    private toastr: ToastrService, private _route: ActivatedRoute, private _router: Router, private _userSocketService: UserSocketService) { }

  ngOnInit() {
    this.getFriends();
  }

  navigateToFriendList = (userId: any) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/lists` , userId, 'all']);
  }

  navigateToFriendRofile = (userId: any) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users` , userId, 'profile']);
  }
  
  navigateToUserActivities = (userId) => {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users` , userId, 'activities']);
  }

  /**
  * @description fetch friends
  * @author Bhaskar Pawar
  */
  public getFriends = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    this._sharedModuleService.getFriends(userId).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.friends = apiResponse.data;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }// end of get friends

}
