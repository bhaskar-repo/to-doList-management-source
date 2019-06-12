import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalService } from 'src/app/global.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { UserValidationService } from '../user-validation.service';
import { Router } from '@angular/router';
import { GlobalConfig } from 'src/app/globalConfig';
import { UserSocketService } from '../user-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private email: String;
  private emailModal: String;
  private password: String;

  @ViewChild('forgotPassModal') forgotPassModal: ElementRef;

  constructor(private _userService: UserService, private _global: GlobalService, private _toastr: ToastrService
    , private _validation: UserValidationService, private _router: Router, private _userSocketService: UserSocketService) { }

  ngOnInit() {
  }

  onSignupBtnClick() {
    this._router.navigate([`/${GlobalConfig.apiVersion}/users/signup`]);
  }
  /**
   * @author Bhaskar Pawar
   * @description will logs in the user to the System
   */
  public logIn = () => {
    let logInData = {
      email: this.email,
      password: this.password
    }

    this._userService.logIn(logInData).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          Cookie.set("authToken", apiResponse.data.authToken);
          Cookie.set("userId", apiResponse.data.userDetails.userId);
          Cookie.set("userName", apiResponse.data.userDetails.firstName + " " + apiResponse.data.userDetails.lastName);
         
          this._userService.setToLocalStorage(apiResponse.data.userDetails);
          this._toastr.success(`${apiResponse.message}`, 'Success !');
          setTimeout(() => {
            this._userSocketService.emitJoinSocket(apiResponse.data.userDetails.userId);
          })
          setTimeout(() => {
            this._router.navigate([`/${GlobalConfig.apiVersion}/lists`, Cookie.get('userId'), 'all']);
          }, 500)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })

  }//end of log in

  /**
   * @description validates user email
   * @author Bhaskar Pawar
   */
  public validateUser = () => {
    if (this._validation.validateEmail(this.emailModal)) {
      this._toastr.error("Not a valid email", "Email !");
    }
    else {
      this._userService.checkUserExist(this.emailModal).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 201) {
            this._toastr.info(`${apiResponse.message}`, "Email !");
          }
          if (apiResponse.status === 200) {
            this.forgotPassModal.nativeElement.click();
            this.sendEmail();
          }
        },
        (errorMessage) => {
          this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
        })

    }
  }//end of validate user

  /**
   * @description will send request to send an email
   * @author Bhaskar Pawar
   */
  public sendEmail = () => {
    this._userService.sendEmail(this.emailModal).subscribe(
      (apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._router.navigate([`/${GlobalConfig.apiVersion}/users/resetlink`, this.emailModal]);
          this.emailModal = "";
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }
}
