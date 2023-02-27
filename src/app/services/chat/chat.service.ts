import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private newMessageReceived = new BehaviorSubject<Message>({} as Message);

  constructor() { }

  get newMessageReceived$(): Observable<Message> {
    return this.newMessageReceived.asObservable();
  }

  newMessageArrived(senderId: string, message: string, sendingTime: Date){
    this.newMessageReceived.next(new Message(senderId, message, sendingTime));
  }
}
