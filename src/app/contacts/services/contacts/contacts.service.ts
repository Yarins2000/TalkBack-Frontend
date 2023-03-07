import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private contactsUrl = environment.serverApi + environment.account;
  usersSubject = new Subject<any[]>();

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>(this.contactsUrl + 'users');
  }

  /**
   * Maps a received user from the server to a {@link User} object.
   * @param identityUser the user received from the server
   * @returns new User object.
   */
  private mapUser(identityUser: any) {
    return new User(identityUser.id, identityUser.userName, identityUser.isConnected);
  }

  /**
   * Maps all the users from the received identityUser list from the server.
   * @param identityUsers the users list received from the server
   * @returns a new User object array.
   */
  mapUsers(identityUsers: any[]): User[]{
    return identityUsers.map(user => this.mapUser(user));
  }
}
