import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { hammerjs } from 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { GlobalConfig } from './globalConfig';
import { SharedModule } from './shared/shared.module';
import { TodoListModule } from './todo-list/todo-list.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UserModule,
    SharedModule,
    TodoListModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true
    }),
    RouterModule.forRoot([
      { path: `${GlobalConfig.apiVersion}/users/login`, component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: `${GlobalConfig.apiVersion}/users/login`, pathMatch: 'full' },
      { path: '*', component: LoginComponent, pathMatch: 'full' },
      { path: '**', component: LoginComponent, pathMatch: 'full' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
