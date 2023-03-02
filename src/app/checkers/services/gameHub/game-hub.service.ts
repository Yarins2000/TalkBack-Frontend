import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { environment } from 'src/app/environments/environment';
import { TokenService } from 'src/app/services/token/token.service';

/**
 * A service class for handling the checkers game signalr methods and communication.
 */
@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  hubConnection!: signalR.HubConnection;

  constructor(private tokenService: TokenService) {
    if (tokenService.getItemFromSessionStorage("token") && (!this.hubConnection || this.hubConnection.state === SignalR.HubConnectionState.Disconnected)) {
      this.startConnection();
    }
  }

  /**
   * Starts the hub connection and listens for 'on' hub methods.
   */
  startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.serverApi + environment.gameHubUrl, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.tokenService.getItemFromSessionStorage("token")!
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

  /**
   * Registers a callback function to be called when a game request is received.
   * @param callback A function to be called when a game request is received.
   */
  onGameRequestReceived(callback: () => void): void {
    this.hubConnection.on('gameRequestReceived', () => callback());
  }

  /**
   * Registers a callback function to be called when a user joined a group.
   * @param callback A function to be called when a user joined a group.
   */
  onUserJoined(callback: (connectionId: string) => void): void {
    this.hubConnection.on('userJoined', (connectionId: string) => {
      callback(connectionId);
    });
  }

  /**
   * Registers a callback function to be called when a user has been disconnected.
   * @param callback A function to be called when a user has been disconnected.
   */
  onUserDisconnected(callback: (connectionId: string) => void): void {
    this.hubConnection.on('userDisconnected', (connectionId: string) => {
      callback(connectionId);
    });
  }

  /**
   * Registers a callback function to be called when the group is full.
   * @param callback A function to be called when the group is full.
   */
  onGroupFull(callback: (groupName: string) => void): void {
    this.hubConnection.on('groupFull', (groupName: string) => {
      callback(groupName);
    });
  }

  /**
   * Registers a callback function to be called when a game starts.
   * @param callback A function to be called when a game starts.
   */
  onStartGame(callback: () => void): void {
    this.hubConnection.on('startGame', () => {
      callback();
    });
  }

  /**
   * Registers a callback to be executed when a move is made. The callback receives the result of the move and the coordinates of the moved piece.
   * @param callback a function that receives the move result and the from/to coordinates of the moved piece.
   */
  onMoveMade(callback: (moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number, canSwitchTurns: boolean) => void): void {
    this.hubConnection.on('moveMade', (moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number, canSwitchTurns: boolean) => {
      callback(moveResult, fromRow, fromColumn, toRow, toColumn, canSwitchTurns);
    });
  }

  /**
   * Registers a callback function to be called when an invalid move was happend.
   * @param callback A function to be called when an invalid move was happend.
   */
  onInvalidMove(callback: () => void): void {
    this.hubConnection.on('invalidMove', () => callback());
  }

  /**
   * Sends a game request to a specified recipient using SignalR hub connection.
   * @param recipientId The ID of the recipient user.
   */
  sendGameRequest(recipientId: string) {
    this.hubConnection.invoke("SendGameRequest", recipientId);
  }

  /**
   * Joins the specified group in the SignalR hub connection.
   * @param groupName The name of the group to join.
   */
  joinGroup(groupName: string) {
    this.hubConnection.invoke("JoinGroup", groupName);
  }

  /**
   * Leaves the specified group in the SignalR hub connection
   * @param groupName the name of the group to leave.
   */
  leaveGroup(groupName: string) {
    this.hubConnection.invoke("LeaveGroup", groupName);
  }

  /**
   * Starts the specified group game.
   * @param groupName the name of the group to start.
   */
  startGame(groupName: string) {
    this.hubConnection.invoke("StartGame", groupName);
  }

  /**
   * Makes a move in the specified group's game via SignalR.
   * @param groupName the name of the group's game
   * @param fromRow the starting row
   * @param fromColumn the starting column
   * @param toRow the ending row
   * @param toColumn the ending column
   */
  makeMove(groupName: string, fromRow: number, fromColumn: number, toRow: number, toColumn: number) {
    this.hubConnection.invoke("MakeMove", groupName, fromRow, fromColumn, toRow, toColumn);
  }

  /**
   * Stops the SignalR hub connection
   */
  stopConnection() {
    if (this.hubConnection.state === SignalR.HubConnectionState.Connected)
      this.hubConnection.stop().then(_ => console.log("game hub connection closed"));
  }
}
