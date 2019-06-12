import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatTableModule, MatButtonModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HttpErrorHandlerComponent } from './http-error-handler/http-error-handler.component';
import { GlobalConfig } from '../globalConfig';
import { HeaderComponent } from './header/header.component';
import { FirstCharComponent } from './first-char/first-char.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';

@NgModule({
  declarations: [HttpErrorHandlerComponent, HeaderComponent, FirstCharComponent, NotificationDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutocompleteLibModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: `${GlobalConfig.apiVersion}/error`, component: HttpErrorHandlerComponent }
    ])
  ],
  exports: [
    HeaderComponent, FirstCharComponent
  ],
  entryComponents: [NotificationDialogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
