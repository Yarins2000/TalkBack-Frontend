import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from 'src/app/chat/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  /**
   * @property newMessageReceived - a {@link BehaviorSubject} of {@link Message} that contains the latest message received.
   */
  private newMessageReceived = new Subject<Message>();

  constructor() { }

  /**
   * A getter for the message subject, returns it as observable.
   */
  get newMessageReceived$(): Observable<Message> {
    return this.newMessageReceived.asObservable();
  }

  /**
   * Emits a new message object to the subscribers of the newMessageReceived subject.
   * @param senderId the id of the message sender
   * @param message the message's content
   * @param sendingTime the time the message was sent
   */
  newMessageArrived(senderId: string, message: string, sendingTime: Date){
    this.newMessageReceived.next(new Message(senderId, message, sendingTime));
  }
}
