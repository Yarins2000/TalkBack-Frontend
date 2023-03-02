import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameHubService } from 'src/app/checkers/services/gameHub/game-hub.service';
import { ChatSignalRService } from 'src/app/hubServices/chatSignalR/chatSignalR.service';
import { ContactsSignalRService } from 'src/app/hubServices/contactsSignalR/contactsSignalR.service';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account/account.service';
import { ChatSharedDataService } from 'src/app/services/chat-shared-data/chat-shared-data.service';
import { TokenService } from 'src/app/services/token/token.service';
import { AppState } from 'src/app/state/app.state';
import * as UsersSelectors from 'src/app/state/users.selectors';
import * as UsersActions from '../../state/users.actions';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  currentUsername: string = "";
  selectedUser?: User;
  users$: Observable<User[]>;

  constructor(private contactsSignalRService: ContactsSignalRService, private accountService: AccountService, private router: Router, 
    private store: Store<AppState>, private chatSharedDataService: ChatSharedDataService, private tokenService: TokenService,
    private chatSignalRService: ChatSignalRService, private gameHubService: GameHubService) {

    this.users$ = this.store.pipe(select(UsersSelectors.usersSelector));
  }

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
    this.currentUsername = this.tokenService.getUsernameFromToken("token");
  }

  /**
   * Executes methods when a user has logged out.
   */
  onLogout() {
    let username = this.tokenService.getUsernameFromToken("token");
    let loggedOutUser!: User;
    this.store.select(UsersSelectors.selectUserByUsername(username)).subscribe(user => loggedOutUser = user);

    this.accountService.logout().subscribe();

    this.contactsSignalRService.newLogout(username);

    this.store.dispatch(UsersActions.userLogout({ loggedOutUser: loggedOutUser }));

    this.chatSignalRService.closeConnection();

    this.gameHubService.stopConnection();

    this.router.navigate(['/signin']);
  }

  /**
   * Returns the logged out users.
   */
  get loggedOutUsers(): Observable<User[]> {
    return this.users$.pipe(map(users => users.filter(user => !user.isConnected)));
  }

  /**
   * Returns the logged in users
   */
  get loggedInUsers(): Observable<User[]>{
    return this.users$.pipe(map(users => users.filter(user => user.isConnected && user.username !== this.currentUsername)));
  }

  /**
   * Returns the current user by his username.
   */
  get currentUser(): Observable<User>{
    return this.store.select(UsersSelectors.selectUserByUsername(this.currentUsername));
  }

  /**
   * Navigates to chat component and sends the current user and the recipient via {@link ChatSharedDataService}.
   * @param recipient the recipient user
   */
  navigateToChat(recipient: User){
    let currentUser! : User;
    this.store.select(UsersSelectors.selectUserByUsername(this.currentUsername))
              .subscribe(user => currentUser = user);

    this.chatSharedDataService.updateUsers(currentUser, recipient);
    this.router.navigate(['/chat'], );
  }
}
