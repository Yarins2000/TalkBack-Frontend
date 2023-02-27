import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { environment } from 'src/app/environments/environment';
import { TokenService } from 'src/app/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  hubConnection!: signalR.HubConnection;

  constructor(private tokenService: TokenService) {
    if (tokenService.getToken("token") && (!this.hubConnection || this.hubConnection.state === SignalR.HubConnectionState.Disconnected)) {
      this.startConnection();
    }
  }

  startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.serverApi + environment.gameHubUrl, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.tokenService.getToken("token")!
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 600000;

    //later on remove console
    this.hubConnection.start()
      .then(() => {
        console.log('game connection started from service...');
      })
      .catch((err) => {
        console.log('error: ' + err.message);
      });

    this.onUserJoined((connectionId: string) => {
      console.log("user with connectionId: " + connectionId + " has joined the group");
    });

    this.onGroupFull((groupName) => {
      console.log("the group, with group name: " + groupName + " is full");
    });

    this.onUserDisconnected((connectionId: string) => {
      console.log("user with connectionId: " + connectionId + " has disconnected");
    });
  }

  onGameRequestReceived(callback: () => void): void {
    this.hubConnection.on('gameRequestReceived', () => callback());
  }

  //executing a callback when a user joined a group.
  onUserJoined(callback: (connectionId: string) => void): void {
    this.hubConnection.on('userJoined', (connectionId: string) => {
      callback(connectionId);
    });
  }

  //executing a callback when a user disconnected from the hub connection.
  onUserDisconnected(callback: (connectionId: string) => void): void {
    this.hubConnection.on('userDisconnected', (connectionId: string) => {
      callback(connectionId);
    });
  }

  //execute a callback when a user is trying to join a group and it's full.
  onGroupFull(callback: (groupName: string) => void): void {
    this.hubConnection.on('groupFull', (groupName: string) => {
      callback(groupName);
    });
  }

  //execute a callback when a game start.
  onStartGame(callback: () => void): void {
    this.hubConnection.on('startGame', () => {
      callback();
    });
  }

  //execute a callback when a player made a move.
  onMoveMade(callback: (moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number) => void): void {
    this.hubConnection.on('moveMade', (moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number) => {
      callback(moveResult, fromRow, fromColumn, toRow, toColumn);
    });
  }

  onInvalidMove(callback: () => void): void {
    this.hubConnection.on('invalidMove', () => callback());    
  }

  sendGameRequest(recipientId: string) {
    this.hubConnection.invoke("SendGameRequest", recipientId);
  }

  joinGroup(groupName: string) {
    this.hubConnection.invoke("JoinGroup", groupName);
  }

  leaveGroup(groupName: string) {
    this.hubConnection.invoke("LeaveGroup", groupName);
  }

  startGame(groupName: string) {
    this.hubConnection.invoke("StartGame", groupName);
  }

  makeMove(groupName: string, fromRow: number, fromColumn: number, toRow: number, toColumn: number) {
    this.hubConnection.invoke("MakeMove", groupName, fromRow, fromColumn, toRow, toColumn);
  }

  stopConnection() {
    if (this.hubConnection.state === SignalR.HubConnectionState.Connected)
      this.hubConnection.stop().then(_ => console.log("game hub connection closed"));
  }
}
