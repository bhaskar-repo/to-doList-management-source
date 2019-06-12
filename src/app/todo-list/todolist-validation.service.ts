import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodolistValidationService {

  constructor() { }

  public validateMarkDoneItem = (itemObj): boolean => {
    let flag = false;
    if (itemObj.subitemsList.length > 0) {
      let totalLength = itemObj.subitemsList.length;
      let isDoneLength = itemObj.subitemsList.filter(subItem => subItem.isDone === true).length;
      if (totalLength === isDoneLength) {
        flag = false
      }
      else {
        flag = true;
      }
    }
    return flag;
  }

  public validateIsNochanges = (oldValues, newValues, newFileName): string => {

    let auditString = "";
    if (oldValues.title !== newValues.title) {
      auditString = auditString + "title, ";
    }
    if (oldValues.description !== newValues.description) {
      auditString = auditString + "description, ";
    }
    if (oldValues.dueDate !== newValues.dueDate) {
      auditString = auditString + "dueDate,";
    }

    if (newFileName !== undefined && (oldValues.fileName !== newFileName)) {
      auditString = auditString + "file Name,";
    }

    return auditString;
  }

 
}
