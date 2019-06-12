import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { GlobalService } from 'src/app/global.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConfig } from 'src/app/globalConfig';
import { UserValidationService } from '../user-validation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private password: String;
  private confirmPassword: String;

  constructor(private _router: Router, private _route: ActivatedRoute,
    private _userService: UserService, private _global: GlobalService, private _toastr: ToastrService,
    private _userValidation: UserValidationService) { }

  ngOnInit() {
  }

  /**
   * @description request the server to set new password
   * @author Bhaskar Pawar
   */
  public resetPassword = () => {
    let email = this._route.snapshot.queryParamMap.get('email');
    let data = {
      email: email,
      password: this.password,
    }
    if (this.password !== this.confirmPassword) {
      this._toastr.info("Passwords not matching", 'Password !');
    }
    else if (this._userValidation.validatePassword(this.password)) {
      this._toastr.info("Minimum 8 characters which contain only characters,numeric digits, underscore and first character must be a letter", "Password !");
    }
    else {
      this._userService.resetPassword(data).subscribe((apiResponse) => {
        if (this._global.checkResStatus(apiResponse)) {
          this._toastr.success(apiResponse.message, "Success !");
          setTimeout(() => {
            this._router.navigate([`/${GlobalConfig.apiVersion}/users/login`]);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
    }
  }//end of rest password

}
