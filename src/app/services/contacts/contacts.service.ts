import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contactsUrl = environment.serverApi + environment.account;
  usersSubject = new Subject<any[]>();

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>(this.contactsUrl + 'users');
  }

  mapUser(identityUser: any) {
    return new User(identityUser.id, identityUser.userName, identityUser.isConnected);
  }

  mapUsers(identityUser: any[]): User[]{
    return identityUser.map(user => this.mapUser(user));
  }

  findUser(username: string, userList: User[]) {
    return userList.find(user => user.username === username);
  }
}
