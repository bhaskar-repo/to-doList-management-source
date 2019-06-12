import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from 'src/app/globalConfig';
import { SharedModuleService } from 'src/app/shared/shared-module.service';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent implements OnInit {
  
  private userName = Cookie.get('userName');
  private usersData = [];

  constructor(private _sharedModuleService: SharedModuleService, private _global: GlobalService,
    private _router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

   /**
   * @description This will fetch the userslist to send the request
   * @author Bhaskar Pawar
   */
  getUsers = () => {
    this._sharedModuleService.getUsersWithoutFriends().subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this.usersData = apiResponse.data;
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      }
    )
  }//end of on click find friends

  public onSelectUser = (user) => {
      this._router.navigate([`/${GlobalConfig.apiVersion}/users`, user.userId, 'profile']);
  }//end of on select users

}
