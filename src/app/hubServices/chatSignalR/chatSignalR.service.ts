import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { TokenService } from 'src/app/services/token/token.service';
import { environment } from '../../environments/environment';
import { ChatService } from '../../services/chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatSignalRService {
  hubConnection!: SignalR.HubConnection;

  constructor(private chatService: ChatService, private tokenService: TokenService) {
    if (tokenService.getToken("token") && (!this.hubConnection || this.hubConnection.state === SignalR.HubConnectionState.Disconnected)) {
      this.startConnection();
    }
  }

  startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.serverApi + environment.chatHubUrl, {
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
        console.log('chat connection started from service...');
      })
      .catch((err) => {
        console.log('error: ' + err.message);
      });

    this.receiveMessage();
    this.messageNotReceived();
  }

  sendMessage(senderId: string, recipientId: string, message: string, isRecipientConnected: boolean) {
    this.hubConnection.invoke("SendMessageToUser", senderId, recipientId, message, isRecipientConnected)
      .catch(err => console.error(err));
  }

  receiveMessage() {
    this.hubConnection.on("receiveMessage", (senderId: string, message: string, date: string) => {
      const dateTime = new Date(date);
      this.chatService.newMessageArrived(senderId, message, dateTime);
    });
  }

  messageNotReceived() {
    this.hubConnection.on("messageNotRecieved", (errorMessage: string) => {
      console.log(errorMessage);
    })
  }

  closeConnection() {
    this.hubConnection.stop().then(() => console.log("chat connection closed"));
  }
}
