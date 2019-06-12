import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ListDashboardComponent } from './list-dashboard/list-dashboard.component';
import { GlobalConfig } from '../globalConfig';
import { TodoListRouteGuardService } from './todo-list-route-guard.service';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditListComponent } from './edit-list/edit-list.component';
import { ViewItemComponent } from './view-item/view-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListDashboardComponent, EditItemComponent, EditListComponent, ViewItemComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    OwlDateTimeModule,
    FileUploadModule,
    OwlNativeDateTimeModule,
    RouterModule.forChild([
      { path: `${GlobalConfig.apiVersion}/lists/:userId/all`, component: ListDashboardComponent, canActivate: [TodoListRouteGuardService] },
      { path: `${GlobalConfig.apiVersion}/lists/:userId/:listId/edit`, component: EditListComponent, canActivate: [TodoListRouteGuardService] },
      { path: `${GlobalConfig.apiVersion}/lists/:userId/:listId/:itemId/edit`, component: EditItemComponent, canActivate: [TodoListRouteGuardService] },
      { path: `${GlobalConfig.apiVersion}/lists/:userId/:listId/:itemId/view`, component: ViewItemComponent, canActivate: [TodoListRouteGuardService] }
    ])
  ]
})
export class TodoListModule { }
