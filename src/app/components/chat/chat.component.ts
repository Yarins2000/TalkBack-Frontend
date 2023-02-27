import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from 'src/app/hubServices/chatSignalR/chatSignalR.service';
import { ChatParticipants } from 'src/app/models/ChatParticipantsIds.model';
import { Message } from 'src/app/models/message.model';
import { ChatSharedDataService } from 'src/app/services/chat-shared-data/chat-shared-data.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { DatePipe } from '@angular/common';
import { GameHubService } from 'src/app/checkers/services/gameHub/game-hub.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GameRequestService } from 'src/app/services/game-request/game-request.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messageInput: string = "";
  messages: Message[] = [];

  private subscription!: Subscription;

  chatParticipants!: ChatParticipants;

  private invitationModal?: TemplateRef<any>;
  invitationModalRef?: NgbModalRef;
  waitingModalRef?: NgbModalRef;
  @ViewChild('waitingModal', { static: true }) waitingModal?: TemplateRef<any>;

  @ViewChild('invitationModal') set content(content: TemplateRef<any>) {
    this.invitationModal = content;
  }

  constructor(private chatService: ChatService, private chatSignalRService: ChatSignalRService, private router: Router,
    private chatSharedDataService: ChatSharedDataService, private gameHubService: GameHubService, private modal: NgbModal,
    private gameRequestService: GameRequestService) { }

  ngOnInit(): void {
    this.subscription = this.chatSharedDataService.users$.subscribe(chatParticipents => {
      this.chatParticipants = chatParticipents;
    });
    this.chatService.newMessageReceived$.subscribe(message => {
      this.messages.push(message);
      // this.handleSentMessage(message);
    })
    this.gameHubService.onGameRequestReceived(() => {
      this.openRequestPopup(this.invitationModal!);
    });

    this.gameRequestService.gameRequestSent$.subscribe(value => {
      if (value)
        this.openWaitingPopup(this.waitingModal!);
      else
        this.gameRequestService.waitingModalRef?.close();
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      console.log(this.messageInput);
      this.chatSignalRService.sendMessage(this.chatParticipants.sender.id, this.chatParticipants.recipient.id, this.messageInput, this.chatParticipants.recipient.isConnected);
      // this.chatService.newMessageReceived$.subscribe(message => this.messages.push(message));
      this.handleSentMessage({ senderId: this.chatParticipants.sender.id, message: this.messageInput, sendingTime: new Date() })
      this.messageInput = "";
    }
  }

  isMessageSentByCurrentUser(message: Message) {
    if (message.senderId === this.chatParticipants.sender.id) {
      return true;
    }
    return false;
  }

  private handleSentMessage(message: Message) {
    if (message.senderId === this.chatParticipants.sender.id) {
      this.messages.push(message);
    }
  }

  openRequestPopup(content: TemplateRef<any>) {
    this.gameRequestService.invitationModalRef = this.modal.open(content);
  }

  openWaitingPopup(content: TemplateRef<any>) {
    this.gameRequestService.waitingModalRef = this.modal.open(content);
  }

  acceptGameRequest(modal: NgbActiveModal) {
    this.gameRequestService.setGameRequest(false);
    this.gameRequestService.setRequestAccepted(true);
    modal.close();
    this.gameRequestService.closeModals();

    //sending the users reversed because each user sees himself as the sender.
    this.router.navigate(['/checkers'], {
      queryParams: {
        senderId: this.chatParticipants.recipient.id, recipientId: this.chatParticipants.sender.id,
        isCurrentPlayer: false
      }
    });
  }

  sendGameRequest() {
    this.gameRequestService.setGameRequest(true);
    // this.gameRequestService.setRequestAccepted(true);
    this.router.navigate(['/checkers'], {
      queryParams: {
        senderId: this.chatParticipants.sender.id, recipientId: this.chatParticipants.recipient.id,
        isCurrentPlayer: true
      }
    });
    this.gameHubService.sendGameRequest(this.chatParticipants.recipient.id);
  }

  declineGameRequest() {
    this.gameRequestService.closeModals();
    this.gameRequestService.setGameRequest(false);
    this.gameRequestService.setRequestAccepted(false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}