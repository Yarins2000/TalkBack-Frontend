import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { TokenService } from 'src/app/services/token/token.service';
import { environment } from '../../../environments/environment';
import { Message } from '../../models/message.model';
import { ChatService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatSignalRService {
  hubConnection!: SignalR.HubConnection;

  constructor(private tokenService: TokenService) {
    if (tokenService.getItemFromSessionStorage("token") && (!this.hubConnection || this.hubConnection.state !== SignalR.HubConnectionState.Connected)) {
      this.startConnection();
    }
  }

  /**
   * Starts the hub connection and registers the hub methods
   */
  startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.serverApi + environment.chatHubUrl, {
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
        console.log('chat connection started from service...');
      })
      .catch((err) => {
        console.log('error: ' + err.message);
      });

    this.messageNotReceived();
  }

  /**
   * Registers a method to be called when the message has not been received.
   */
  messageNotReceived() {
    this.hubConnection.on("messageNotRecieved", (errorMessage: string) => {
      console.log(errorMessage);
    })
  }
  /////////////////////////////////////////////////////////////////////////////

  groupNameReceived(callback: (groupName: string) => void) {
    this.hubConnection.on("groupNameReceived", (groupName: string) => {
      callback(groupName);
    });
  }

  joinGroup(senderId: string, recipientId: string) {
    this.hubConnection.invoke("JoinGroup", senderId, recipientId);
  }

  leaveGroup(groupName: string) {
    this.hubConnection.invoke("LeaveGroup", groupName);
  }

  receiveMessage(callback: (senderId: string, message: string, time: string) => void) {
    this.hubConnection.on("receiveMessage", (senderId: string, message: string, time: string) => {
      callback(senderId, message, time);
    });
  }

  receiveAllMessages(callback: (messages: { senderId: string, messageContent: string, timeSent: string }[]) => void) {
    this.hubConnection.on("receiveAllMessages", (messages: { senderId: string, messageContent: string, timeSent: string }[]) => {
      callback(messages);
    })
  }

  notifyUser(callback: () => void){
    this.hubConnection.on("notifyUser", () => callback());
  }

  sendMessage(senderId: string, groupName: string, message: string) {
    this.hubConnection.invoke("SendMessage", senderId, groupName, message);
  }

  unregisterReceiveMessage() {
    this.hubConnection.off("receiveMessage");
  }

  unregisterNotifyUser(){
    this.hubConnection.off("notifyUser");
  }

  /**
   * Closes the hub connection
   */
  closeConnection() {
    this.hubConnection.stop().then(() => console.log("chat connection closed"));
  }
}
