import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatParticipants } from 'src/app/models/ChatParticipantsIds.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatSharedDataService {
  /**
   * @property usersSubject - a {@link BehaviorSubject} of {@link ChatParticipants} that contains the latest chat participants.
   */
  private usersSubject = new BehaviorSubject<ChatParticipants>({sender: {} as User, recipient: {} as User});

  /**
   * A getter for the users subject, returns it as observable.
   */
  get users$(): Observable<ChatParticipants> {
    return this.usersSubject.asObservable();
  }

  constructor() { }

  /**
   * Emits a new {@link ChatParticipants} object to the subscribers of the usersSubject subject.
   * @param sender the sender user
   * @param recipient the recipient user
   */
  updateUsers(sender: User, recipient: User) {
    this.usersSubject.next({ sender, recipient });
  }
}