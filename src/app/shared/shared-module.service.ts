import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs';
import { GlobalConfig } from '../globalConfig';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class SharedModuleService {

  private baseUrl = `${GlobalConfig.serverUrl}/${GlobalConfig.apiVersion}/users`;
  private clientBaseUrl = `${GlobalConfig.clientUrl}/${GlobalConfig.apiVersion}/users`;

  constructor(private _http: HttpClient) { }

  /**
   * @description fetches user which are not friends
   * @author Bhaskar Pawar
   */
  public getUsersWithoutFriends = (): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${Cookie.get('userId')}/notfriends?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }//end get users without friends

  /**
     * @description fetches selected user
     * @author Bhaskar Pawar
     */
  public getSingleUser = (userId): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/profile?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }//end of get single user

  /**
   * @description get requests
   * @author Bhaskar Pawar
   * @returns {any} response
   */
  public getRequests = (userId): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/requests?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }// get requests

  /**
   * @description get friends
   * @author Bhaskar Pawar
   * @returns {any} response
   */
  public getFriends = (userId): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/friends?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }// get friends

  /**
   * @description request to fetch activities from the DB
   * @author Bhaskar Pawar
   * @param {any} userId
   */
  public getActivities = (userId: any): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/activities?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }//end of get activities

  /**
   * @description deletes the actitvity from DB
   * @author Bhaskar Pawar
   * @param {any} userId
   * @param {any} activityId
   */
  public deleteActivity = (userId, activityId) => {
    return this._http.post(`${this.baseUrl}/${userId}/activities/${activityId}/delete?authToken=${Cookie.get('authToken')}`, activityId).catch(this.handleError);
  }//end of delete activity

  /**
   * @description request to server to save a friend request
   * @author Bhaskar Pawar
   * @param {any} data
   * @returns {any} repsonse
   */
  public updateSentRequest = (data: any, userId: any): Observable<any> => {
    let params = new HttpParams()
      .set('userId', data.userId)
      .set('userName', data.userName)
      .set('countryName', data.countryName)

    return this._http.post(`${this.baseUrl}/${userId}/sendrequest?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }

  /**
   * @description accepts freind requests
   * @author Bhaskar Pawar
   * @param {any} data
   */
  public acceptFriendRequest = (data): Observable<any> => {
    let params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('receiverId', data.receiverId)
      .set('receiverName', data.receiverName)
      .set('senderCountry', data.senderCountry)
      .set('receiverCountry', data.receiverCountry)

    return this._http.post(`${this.baseUrl}/requests/accept?authToken=${Cookie.get('authToken')}`, params);
  }//end of accept friend request

  /**
   * @description delete the request from DB
   * @author Bhaskar Pawar
   * @param {any} data
   */
  public cancelUserRequest = (data: any): Observable<any> => {
    let params = new HttpParams()
      .set('userId', data.userId)

    return this._http.post(`${this.baseUrl}/${Cookie.get('userId')}/requests/delete?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }//end of cancel user request 

  /**
   * @author Bhaskar Pawar
   * @description this is to handle http error repsonse
   * @param err 
   */
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}: (${err.error.message})`;
    } // end condition *if
    return Observable.throw(errorMessage);

  }  // END handleError
}

