# Todo Management System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## More About Application

TO DO LIST MANAGEMENT SYSTEM

Applications has mainly three modules
 
  * **USER MODULE**
  * **TODOLIST MODULE**
  * **SHARED MODULE**
  
  * USER -> it includes sign up,login,requests,activities,friends,find friends functionalities
		signup -> during sign up user is able to sign up with country and country phone code.
			   -> added validation for fields like email,password and mobile
			   -> upon login user will be redirected to login page.
		login  -> user can login through registered email followed authentication mechanism generating jwt.
				  client side from validation for gmail and password is added.
		requests -> requests is a section where all the requests from other users will land.
					user can either cancel request or accept it. once accepted friends will be notified.
		activities -> user can see the his own activities as well as friends activities 
					 user can undo activities
					 
		Friends -> all the friends of user are listed under this section.
		           from here user can see friends list,profile,and activities.
		find friends -> here you will find a button where all the friends are listed to whom you send a request.
		
  * TODOLIST -> it has three parts, List,Items,subItems
			
		List -> upon login user will see an option to add an empty list, user can delete the list too.
			 -> here user can edit the list.
		Item -> on edit of list user can add items to the list and delete item from the list
			 -> on edit of item user is redirected to edit page here user can edit title,description,duedate and upload file too.
		subItem -> in edit section of item only user is able to add sub item.
		
		->mark done/open functionalities added for both item and subitems if you are adding sub items to items you must mark
			them complete, then only you can mark main item done.
		-> user can only edit the item if user has marked that item open 
		
		-> Dashboard also you can check the status of to dos if markded done green color will be shown
		
		-> i have used font-awesome icons instead of buttons in most of the places.
		
		-> on each action client will emit socket event for that particular action.
		
  * SHARED MODULE -> all the common things requred are kept here,
				-> header is kept in this module all the major actions have seperated with nav bar links
				-> http header is a component when any error the user will be redirected to this page
				-> hanled error with diffrent page.
				
  * Exra points -> 
			- >added file upload functionality.
			- > added icon for each action.

note: i am storing my secretKey in database. need to add an entry for each db connection (secretKey: "") in globalcofig table
for more details kindly refer to the microsoft world doc attached.

cntrl + z will work on activities page last action will be deleted and reverted back.

i have added only few of events in event docs,it is a very big params



## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
