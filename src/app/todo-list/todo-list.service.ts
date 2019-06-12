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
export class TodoListService {

  private baseUrl = `${GlobalConfig.serverUrl}/${GlobalConfig.apiVersion}/lists`;
  private clientBaseUrl = `${GlobalConfig.clientUrl}/${GlobalConfig.apiVersion}/lists`;

  constructor(private _http: HttpClient) { }

  /**
   * @description get all the list from backend
   * @author Bhaskar Pawar
   * @param {any} userId
   */
  public getAllLists = (userId: any): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/all?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }//end of get all the  lists

  /**
   * @description request to fetch single list from db
   * @author Bhaskar Pawar
   * @param {any} userId
   * @param {any} listId
   */
  public getSingleList = (userId: any, listId: any): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/${listId}/edit?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }

  /**
   * @description will request server to create a new list
   * @author Bhaskar Pawar
   * @returns {response} http
   */
  public createNewList = (newListData: any): Observable<any> => {
    let params = new HttpParams()
      .set('title', newListData.title)
      .set('owner', newListData.owner)
    return this._http.post(`${this.baseUrl}/create?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }

  /**
   * @description requests sever to delete the list
   * @author Bhaskar Pawar
   * @param {any} userId
   * @param {any} listData
   * @returns {Response} http error response
   */
  public deleteList = (userId: any, listData: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listData.id}/delete?authToken=${Cookie.get('authToken')}`, listData).catch(this.handleError);
  }//end of delete list

  /**
   * @description sends request to add the item to list
   * @author Bhaskar Pawar
   * @returns {Response}
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   */
  public addItemToList = (userId: any, data: any, listId: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/add?authToken=${Cookie.get('authToken')}`, data).catch(this.handleError);
  }//end of addItemToList

  /**
   * @description sends request to add the sub item to item
   * @author Bhaskar Pawar
   * @returns {Response}
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   */
  public addSubItemToItemsList = (userId: any, data: any, listId: any, itemId: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/add?authToken=${Cookie.get('authToken')}`, data).catch(this.handleError);
  }//end of add sub item to item


  /**
   * @description sends request to delete item from list
   * @author Bhaskar Pawar
   * @returns {Response}
   * @param {any} userId
   * @param {any} listId
   */
  public deleteItemFromList = (userId, listId, item): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${item.itemId}/delete?authToken=${Cookie.get('authToken')}`, item).catch(this.handleError);
  }//end of delete item from list

  /**
 * @description sends request to delete sub item from items list
 * @author Bhaskar Pawar
 * @returns {Response}
 * @param {any} userId
 * @param {any} listId
 * @param {any} itemId
 * @param {any} subItemObj
 */
  public deleteSubItemFromItemsList = (userId, listId, itemId, subItemObj): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/${subItemObj.subItemId}/delete?authToken=${Cookie.get('authToken')}`, subItemObj).catch(this.handleError);
  }//end of delete sub item from the items list

  /**
   * @author Bhaskar Pawar
   * @description will fetch the item from list
   * @param {any} userId
   * @param {any} listId
   * @param {any} itemId
   */
  public getSingleItem = (userId, listId, itemId): Observable<any> => {
    return this._http.get(`${this.baseUrl}/${userId}/${listId}/${itemId}/edit?authToken=${Cookie.get('authToken')}`).catch(this.handleError);
  }//end of get single item

  public uploadFile = (userId, listId, itemId,fileData) => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/upload?authToken=${Cookie.get('authToken')}`, fileData).catch(this.handleError);
  }

  /**
   * @author Bhaskar Pawar
   * @description request to edit the iten to the list
   * @param {any} userId
   * @param {any} itemData
   * @param {any} listId
   * @param {any} itemId
   * @returns {Response} response  
   */
  public editItemInList = (userId, itemData, listId, itemId): Observable<any> => {
    let params = new HttpParams()
      .set('title', itemData.title)
      .set('description', itemData.description)
      .set('dueDate', itemData.dueDate)
      .set('fileName', itemData.fileName)
      .set('fileLocation', itemData.fileLocation)

    return this._http.put(`${this.baseUrl}/${userId}/${listId}/${itemId}/edit?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }// end of edit item to list

  /**
   * @author Bhaskar Pawar
   * @description request to mark item open
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   * @returns {Response} response  
   */
  public markItemIsOpen = (userId: any, data: any, listId: any, itemId: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/markopen?authToken=${Cookie.get('authToken')}`, data).catch(this.handleError);
  }// end of mark item open

  /**
   * @author Bhaskar Pawar
   * @description request to mark item close
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   * @returns {Response} response  
   */
  public markItemIsClose = (userId: any, data: any, listId: any, itemId: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/markclose?authToken=${Cookie.get('authToken')}`, data).catch(this.handleError);
  }// end of mark item close

  /**
   * @author Bhaskar Pawar
   * @description request to mark the item done
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   * @returns {Response} response  
   */
  public markItemIsDone = (userId: any, data: any, listId: any, itemId: any): Observable<any> => {
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/markdone?authToken=${Cookie.get('authToken')}`, data).catch(this.handleError);
  }//end of mark item done

  /**
   * @description requests server to mark subitem done
   * @author Bhaskar Pawar
   *  @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   * @param {any} subItemId
   * @returns {Response} response  
   */
  public markSubItemDone = (userId, data, listId, itemId, subItemId): Observable<any> => {
    let params = new HttpParams()
      .set('isDone', data.isDone);
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/${subItemId}/markdone?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }//end of mark sub item done

   /**
   * @description requests server to mark subitem close
   * @author Bhaskar Pawar
   * @param {any} userId
   * @param {any} data
   * @param {any} listId
   * @param {any} itemId
   * @param {any} subItemId
   * @returns {Response} response  
   */
  public markSubItemClose = (userId, data, listId, itemId, subItemId): Observable<any> => {
    let params = new HttpParams()
      .set('isDone', data.isDone);
    return this._http.post(`${this.baseUrl}/${userId}/${listId}/${itemId}/${subItemId}/markclose?authToken=${Cookie.get('authToken')}`, params).catch(this.handleError);
  }//end of mark sub item close

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
