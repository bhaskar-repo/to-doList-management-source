import { Component, OnInit } from '@angular/core';
import { User } from './User';
import { UserService } from '../user.service';
import { GlobalService } from 'src/app/global.service';
import { UserValidationService } from '../user-validation.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { GlobalConfig } from 'src/app/globalConfig';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private firstName: String;
  private lastName: String;
  private email: String;
  private password: String;
  private countryName: String;
  private mobileNumber: Number;
  private countryCode: String;
  private isChecked: Boolean;
  private countryNamesObj = [];
  private countryPhoneCodes: any;
  private countryPhoneCode: any;

  constructor(private _userService: UserService, private _global: GlobalService, private userValidation: UserValidationService
    , private _toastr: ToastrService, private _location: Location, private _router: Router) { }

  ngOnInit() {
    this.getcountryNamesObj();
    this.getCountryPhoneCodes();
  }

  public goBack = () => {
    this._location.back();
  }

  /**
   * @author Bhaskar Pawar
   * @description on change of country get countryCode and countryName
   * @param {String} countryCode
   */
  public onCountryChange = (countryCode) => {
    this.countryPhoneCode = this.countryPhoneCodes[countryCode];
    this.countryName = this.countryNamesObj.find(obj => obj.countryCode === countryCode).countryName;
  }// end of on country change

  /**
  * @author Bhaskar Pawar
  * @description this fetches the object from json for country names
  */
  public getcountryNamesObj = () => {
    this._userService.getCountryNamesObj().subscribe(data => {
      for (let obj of Object.entries(data)) {
        let newObj = {
          countryCode: obj[0],
          countryName: obj[1]
        }
        this.countryNamesObj.push(newObj);
      }
    },
    errorMessage => {
      this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
    })
  }//end of get country names

  /**
  * @author Bhaskar Pawar
  * @description this fetches the object from json for country phone codes
  */
  public getCountryPhoneCodes = () => {
    this._userService.getCountryPhonesobj().subscribe(data => {
      this.countryPhoneCodes = data;
    })
  }//end of get country phone codes
  
  /**
   * @author Bhaskar Pawar
   * @description This saves the user data on successful transcation and signs up
   */
  public signUp = () => {
    if (this.userValidation.validateEmail(this.email)) {
      this._toastr.info("email does not meet the criteria", "Info !");
    }
    else if (this.userValidation.validatePassword(this.password)) {
      this._toastr.info("password does not meet the criteria", "Info !");
    }
    else {
      let user = new User(this.firstName, this.lastName, this.email, this.password, this.countryName, this.mobileNumber, this.countryCode, this.countryPhoneCode);
      this._userService.signUp(user).subscribe((apiResponse) => {
        if(this._global.checkResStatus(apiResponse)){
          this._toastr.success(`${apiResponse.message}`, 'Success !');
          setTimeout(() => {
            this._router.navigate([`/${GlobalConfig.apiVersion}/users/login`]);
          }, 1000)
        }
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
    }
  }// end of sign up function

}
