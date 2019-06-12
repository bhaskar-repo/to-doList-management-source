import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { GlobalConfig } from '../globalConfig';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSocketService {

  private url = `${GlobalConfig.serverUrl}`;
  private socket;
  constructor() {
    this.socket = io(this.url);
  }

  public onSendUserRequest = () => {
    return Observable.create((observer) => {
      this.socket.on('notify-about-request', (data) => {
        observer.next(data);
      })
    })
  }//end of on send user request

  public onAcceptUserRequest = () => {
    return Observable.create((observer) => {
      this.socket.on('request-accepted', (data) => {
        observer.next(data);
      })
    })
  }//end of on accept user request

  public onCancelUserRequest = () => {
    return Observable.create((observer) => {
      this.socket.on('update-cancel-request', (userId) => {
        observer.next(userId);
      })
    })
  }//end of on cancel user request

  public onNotifyListOperation = () => {
    return Observable.create((observer) => {
      this.socket.on('notify-list-operation', (data) => {
        observer.next(data);
      })
    })
  }

  public onNotifyItemOperation = () => {
    return Observable.create((observer) => {
      this.socket.on('notify-item-operation', (data) => {
        observer.next(data);
      })
    })
  }

  public onNotifySubItemOperation = () => {
    return Observable.create((observer) => {
      this.socket.on('notify-subItem-operation', (data) => {
        observer.next(data);
      })
    })
  }

  public onNotifyItemEdited = () => {
    return Observable.create((observer) => {
      this.socket.on('notify-edit-item', (data) => {
        observer.next(data);
      })
    })
  }

  public onDecrementReqCount = () => {
    return Observable.create((observer) => {
      this.socket.on('decrement-request-count', (data) => {
        observer.next(data);
      })
    })
  }

  public onIncrementActitvityCount = () => {
    return Observable.create((observer) => {
      this.socket.on('count-activities', (data) => {
        observer.next(data);
      })
    })
  }

  public onDeleteActivity = () => {
    return Observable.create((observer) => {
      this.socket.on('deleted-activity', (data) => {
        observer.next(data);
      })
    })
  }//end of on delete activity listen event

  //events to be emitted
  public emitSendUserRequest = (data) => {
    this.socket.emit('send-friend-request', data);
  }

  public emitJoinSocket = (userId) => {
    this.socket.emit('join-socket', userId);
  }

  public emitFriendsSocket = (friends) => {
    this.socket.emit('join-friends-room', friends);
  }

  public emitAcceptRequest = (data: any) => {
    this.socket.emit('accept-request', data);
  }//end of emit cancel request

  public emitCancelRequest = (userId: any) => {
    this.socket.emit('cancel-request', userId);
  }//end of emit cancel request

  public emitDeleteActivity = (data: any) => {
    this.socket.emit('delete-activity', data);
  }

}
