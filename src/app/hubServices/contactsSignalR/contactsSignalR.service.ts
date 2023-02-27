import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';
import { AppState } from '../../state/app.state';
import * as UsersActions from '../../state/users.actions';
import * as UsersSelectors from '../../state/users.selectors';

@Injectable({
  providedIn: 'root'
})
export class ContactsSignalRService {
  hubConnection!: SignalR.HubConnection;
  users: User[] = [];
  loggedInUsers: User[] = [];

  constructor(private store: Store<AppState>) { 
    if(!this.hubConnection){
      this.startConnection();
    }
  }

  startConnection() {
    //builds the hubConnection
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.serverApi + environment.contactsHubUrl, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 600000;
    
    //starts the signalR connection
    //later on remove console
    this.hubConnection.start()
      .then(() => {
        console.log('contacts connection started from service...');
      })
      .catch((err) => {
        console.log('error: ' + err.message);
      });

    //registers these 2 functions (when a user logged in and logged out)
    this.newLoginListener();
    this.newLogoutListener();
  }

  stopConnection() {
    if(this.hubConnection.state !== SignalR.HubConnectionState.Disconnected)
      this.hubConnection.stop().then(_ => console.log('contacts connection has stopped'));
  }

  newLogin(username: string) {
    this.hubConnection.invoke('UserLoggedIn', username);
  }

  newLogout(username: string) {
    this.hubConnection.invoke('UserLoggedOut', username);
  }

  newLoginListener() {
    this.hubConnection.on('newLogin', (username: string) => {
      let loggedInUser!: User;
      this.store.select(UsersSelectors.selectUserByUsername(username)).subscribe(user => loggedInUser = user);
      this.store.dispatch(UsersActions.chnageConnectionStatus({user: loggedInUser}));
      this.store.dispatch(UsersActions.userLogin({loggedInUser}));
    });
  }

  newLogoutListener() {
    this.hubConnection.on('newLogout', (username: string) => {
      let loggedOutUser!: User;
      this.store.select(UsersSelectors.selectUserByUsername(username)).subscribe(user => loggedOutUser = user);
      this.store.dispatch(UsersActions.chnageConnectionStatus({user: loggedOutUser}));
      this.store.dispatch(UsersActions.userLogout({loggedOutUser}));
    });
  }
}