import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { GlobalConfig } from '../globalConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListSocketService {

  private url = `${GlobalConfig.serverUrl}`;
  private socket;
  constructor() {
    this.socket = io(this.url);
  }

  // events to be listened 

  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verify-user', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable

  } // end verifyUser

  public updateList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-list', (data) => {
        observer.next(data);
      })
    })
  }// end of update list

  public onUpdateAddedItemList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-added-item-to-list', (item) => {
        observer.next(item);
      })
    })
  }// end of on add item to list

  public onUpdateAddedSubItemItemsList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-added-sub-item-to-items-list', (item) => {
        observer.next(item);
      })
    })
  }// end of on add sub item to items list

  public onDeleteList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-list-deleted', (data) => {
        observer.next(data);
      })
    })
  }

  public onDeleteItemFromList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-deleted-item-list', (data) => {
        observer.next(data);
      })
    })
  }//end of on delete item from the list

  public onDeleteSubItemFromItemsList = () => {
    return Observable.create((observer) => {
      this.socket.on('update-deleted-sub-item-items-list', (data) => {
        observer.next(data);
      })
    })
  }//end of on delete item from the list

  public onMarkDoneSubItem = () => {
    return Observable.create((observer) => {
      this.socket.on('mark-subitem-done-completed', (data) => {
        observer.next(data);
      });
    })
  }//end of on mark done sub item listen event

  public onMarkCloseSubItem = () => {
    return Observable.create((observer) => {
      this.socket.on('mark-subitem-close-completed', (data) => {
        observer.next(data);
      });
    })
  }//end of on mark close sub item listen event

  public onMarkOpenItem = () => {
    return Observable.create((observer) => {
      this.socket.on('mark-item-open-completed', (data) => {
        observer.next(data);
      });
    })
  }//end of on mark open item listen event

  public onMarkCloseItem = () => {
    return Observable.create((observer) => {
      this.socket.on('mark-item-close-completed', (data) => {
        observer.next(data);
      });
    })
  }//end of on mark open item listen event

  public onMarkDoneItem = () => {
    return Observable.create((observer) => {
      this.socket.on('mark-item-done-completed', (data) => {
        observer.next(data);
      });
    })
  }//end of on mark done item listen event

  // events to be emitted

  public setUser = (authToken) => {
    this.socket.emit("set-user", authToken);
  } // end setUser

  public emitCreateNewList = (data:  any) => {
    this.socket.emit('create-new-list', data);
  }

  /**
   * @description emit event to delete the list
   * @author Bhaskar pawar
   * @param {any} data
   */
  public emitDeleteList = (data:  any) => {
    this.socket.emit('delete-list', data);
  }//end of emit event delete list

  /**
   * @author Bhaskar pawar
   * @description emits the add item to list event
   */
  public emitAddItemToList = (data:  any) => {
    this.socket.emit('add-item-to-list', data);
  }// end of emit add item to list

  /**
   * @author Bhaskar pawar
   * @description emits the edit item to list event
   */
  public emitEditItemToList = (data:  any) => {
    this.socket.emit('edit-list-item', data);
  }// end of emit edit item to list

  /**
   * @author Bhaskar pawar
   * @description emits the add sub item to items list event
   */
  public emitAddSubItemToItemsList = (data: any) => {
    this.socket.emit('add-sub-item-to-items-list', data);
  }// end of emit add sub item to items list

  /**
   * @author Bhaskar pawar
   * @description emits the delete item from list event
   */
  public emitdeleteItemFromList = (data: any) => {
    this.socket.emit('delete-list-item', data);
  }// end of emit delet item from list

  /**
  * @author Bhaskar pawar
  * @description emits the delete sub item from items list event
  */
  public emitdeleteSubItemFromItemsList = (data: any) => {
    this.socket.emit('delete-sub-item-from-items-list', data);
  }//end of delete sub item from items list emit

/**
  * @author Bhaskar pawar
  * @description emits the item mark done event
  */
 public emitMarkOpenItem = (data: any) => {
  this.socket.emit('mark-item-open', data);
}//end of emit mark done Item

/**
  * @author Bhaskar pawar
  * @description emits the item mark close event
  */
 public emitMarkCloseItem = (data: any) => {
  this.socket.emit('mark-item-close', data);
}//end of emit mark close Item


  /**
  * @author Bhaskar pawar
  * @description emits the item mark done event
  */
 public emitMarkDoneItem = (data: any) => {
  this.socket.emit('mark-item-done', data);
}//end of emit mark done Item

  /**
  * @author Bhaskar pawar
  * @description emits the sub item mark done event
  */
  public emitMarkDoneSubItem = (data: any) => {
    this.socket.emit('mark-subitem-done', data);
  }//end of emit mark done subItem

  /**
  * @author Bhaskar pawar
  * @description emits the sub item mark done event
  */
 public emitMarkCloseSubItem = (data: any) => {
  this.socket.emit('mark-subitem-close', data);
}//end of emit mark done subItem
}

