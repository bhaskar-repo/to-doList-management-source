import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private _toastr: ToastrService, private _router: Router) { }

  checkResStatus = (apiResponse: any): boolean => {
    let flag = true;
    if (apiResponse.status === 200) {
      flag = true;
    }
    else if (apiResponse.status === 201) {
      flag = false;
      this._toastr.info(`${apiResponse.message}`, "Info !");
    }
    else if (apiResponse.status === 202) {
      flag = false;
      this._toastr.error(`${apiResponse.message}`, "Error !");
    }
    else {
      flag = false;
    }
    return flag;
  }//end of check response status

  navigateToErrorPage = (url: string, param: string): void => {
    this._router.navigate([url], { queryParams: { errorMessage: param } });
  }

}
