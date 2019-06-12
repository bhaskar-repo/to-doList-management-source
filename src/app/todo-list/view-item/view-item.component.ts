import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalConfig } from 'src/app/globalConfig';
import { GlobalService } from 'src/app/global.service';
import { ActivatedRoute } from '@angular/router';
import { TodoListService } from '../todo-list.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {

  private currentItem: any;
  private userName = Cookie.get('userName');

  constructor(private _location: Location, private _global: GlobalService, private _route: ActivatedRoute
    ,private _todoListService: TodoListService) { }

  ngOnInit() {
    this.getSingleItem();
  }

  goBack = () => {
    this._location.back();
  }

  
  /**
   * @author Bhaskar Pawar
   * @description will fetch current item
   */
  public getSingleItem = () => {
    let userId = this._route.snapshot.paramMap.get('userId');
    let listId = this._route.snapshot.paramMap.get('listId');
    let itemId = this._route.snapshot.paramMap.get('itemId');
    this._todoListService.getSingleItem(userId ,listId, itemId).subscribe(
      (apiResponse) => {
        this.currentItem = apiResponse.data;
      },
      (errorMessage) => {
        this._global.navigateToErrorPage(`/${GlobalConfig.apiVersion}/error`, errorMessage);
      })
  }// end of get single Item

}
