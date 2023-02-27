import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatParticipants } from 'src/app/models/ChatParticipantsIds.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatSharedDataService {
  private usersSubject = new BehaviorSubject<ChatParticipants>({sender: {} as User, recipient: {} as User});

  get users$(): Observable<ChatParticipants> {
    return this.usersSubject.asObservable();
  }

  constructor() { }

  updateUsers(sender: User, recipient: User) {
    this.usersSubject.next({ sender, recipient });
  }
}