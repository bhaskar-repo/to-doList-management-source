import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GlobalConfig } from '../globalConfig';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordLinkComponent } from './reset-password-link/reset-password-link.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from '../shared/shared.module';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { FindFriendsComponent } from './find-friends/find-friends.component';
import { FriendsComponent } from './friends/friends.component';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetPasswordComponent, ResetPasswordLinkComponent, UserProfileComponent, UserRequestsComponent, FindFriendsComponent, FriendsComponent, ActivityComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild([
      { path: `${GlobalConfig.apiVersion}/users/signup`, component: SignupComponent },
      { path: `${GlobalConfig.apiVersion}/users/reset`, component: ResetPasswordComponent },
      { path: `${GlobalConfig.apiVersion}/users/resetlink/:email`, component: ResetPasswordLinkComponent },
      { path: `${GlobalConfig.apiVersion}/users/:userId/profile`, component: UserProfileComponent },
      { path: `${GlobalConfig.apiVersion}/users/:userId/requests`, component: UserRequestsComponent },
      { path: `${GlobalConfig.apiVersion}/users/find`, component: FindFriendsComponent },
      { path: `${GlobalConfig.apiVersion}/users/:userId/friends`, component: FriendsComponent },
      { path: `${GlobalConfig.apiVersion}/users/:userId/activities`, component: ActivityComponent }
    ])
  ]
})
export class UserModule { }
