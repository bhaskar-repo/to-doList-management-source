import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs';
import { GlobalConfig } from '../globalConfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${GlobalConfig.serverUrl}/${GlobalConfig.apiVersion}/users`;
  private clientBaseUrl = `${GlobalConfig.clientUrl}/${GlobalConfig.apiVersion}/users`;

  constructor(private _http: HttpClient) { }

  public getCountryNamesObj = (): Observable<any> => {
    return this._http.get("./assets/names.json").catch(this.handleError);
  }

  public getCountryPhonesobj = (): Observable<any> => {
    return this._http.get("./assets/phone.json").catch(this.handleError);
  }

  /**
   * @author Bhaskar Pawar
   * @description calls the backend function for sign up
   * @param {Object} userData
   * @returns {Object} response
   */
  public signUp = (userData): Observable<any> => {
    return this._http.post(`${this.baseUrl}/signup`, userData).catch(this.handleError);
  }

  /**
   * @author Bhaskar Pawar
   * Temporary user information storage
   */
  public setToLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }// end of setLocalStorage 

  /**
   * @author Bhaskar Pawar
   */
  public getFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//end of getFromLocalStorage


  /**
  * @author Bhaskar Pawar
  * @description calls the backend function for logging in
  * @param {Object} userData
  * @returns {Object} response
  */
  public logIn = (loginData): Observable<any> => {
    let params = new HttpParams()
      .set('email', loginData.email)
      .set('password', loginData.password)

    return this._http.post(`${this.baseUrl}/login`, params).catch(this.handleError);
  }

  /**
   * @description make a request to server to reset the password
   * @author Bhaskar Pawar
   * @returns {object} apiResponse
   */
  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this._http.post(`${this.baseUrl}/reset`, params).catch(this.handleError);
  }//end of reset password

  /**
   * @author Bhaskar Pawar
   * @param email
   */
  public checkUserExist = (email): Observable<any> => {
    return this._http.get(`${this.baseUrl}/reset?email=${email}`).catch(this.handleError);
  }// end of check user list

  /**
   * @description requests server to send email
   * @author Bhaskar Pawar
   * @param {any} data
   * @returns {Object} result
   */
  public sendEmail = (email: any): Observable<any> => {
    const params = new HttpParams()
      .set("email", email)
      .set("clientUrl", this.clientBaseUrl);
    return this._http.post(`${this.baseUrl}/sendemail`, params).catch(this.handleError);
  }

  /** 
  * This will delete the temporary data also remove authToken from server
  * @author Bhaskar Pawar
  * @param userId
 */
  public logOut = (userId): Observable<any> => {
    let params = new HttpParams()
      .set('userId', userId)
    return this._http.post(`${this.baseUrl}/logout`, params);
  }//end of log out

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if
    return Observable.throw(errorMessage);

  }  // END handleError
}
