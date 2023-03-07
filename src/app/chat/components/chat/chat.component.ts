import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from 'src/app/chat/services/chatSignalR/chatSignalR.service';
import { ChatParticipants } from 'src/app/chat/models/ChatParticipantsIds.model';
import { Message } from 'src/app/chat/models/message.model';
import { ChatSharedDataService } from 'src/app/chat/services/chat-shared-data/chat-shared-data.service';
import { ChatService } from 'src/app/chat/services/chat/chat.service';
import { DatePipe } from '@angular/common';
import { GameHubService } from 'src/app/checkers/services/gameHub/game-hub.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GameRequestService } from 'src/app/checkers/services/game-request/game-request.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messageInput: string = "";
  messages: Message[] = [];

  private groupName: string = "";

  private sharedDataServiceSub!: Subscription;
  private chatServiceSub!: Subscription;
  private gameRequestSub!: Subscription;

  /**
   * The current chat participents.
   */
  chatParticipants!: ChatParticipants;

  /**
   * The modal template handling the invitation message content and buttons.
   */
  private invitationModal?: TemplateRef<any>;
  /**
   * The ngb modal reference to invitation modal.
   */
  invitationModalRef?: NgbModalRef;
  /**
   * The ngb modal reference to waiting modal content.
   */
  waitingModalRef?: NgbModalRef;
  @ViewChild('waitingModal', { static: true }) waitingModal?: TemplateRef<any>;

  @ViewChild('invitationModal') set content(content: TemplateRef<any>) {
    this.invitationModal = content;
  }

  constructor(private chatService: ChatService, private chatSignalRService: ChatSignalRService, private router: Router,
    private chatSharedDataService: ChatSharedDataService, private gameHubService: GameHubService, private modal: NgbModal,
    private gameRequestService: GameRequestService) {
    this.sharedDataServiceSub = this.chatSharedDataService.users$.subscribe(chatParticipents => {
      this.chatParticipants = chatParticipents;
    });
  }

  ngOnInit(): void {
    this.messages = [];

    this.chatSignalRService.joinGroup(this.chatParticipants.sender.id, this.chatParticipants.recipient.id);
    this.chatSignalRService.groupNameReceived((groupName: string) => {
      this.groupName = groupName;
    })

    this.chatSignalRService.receiveMessage((senderId: string, message: string, time: string) => {
      this.chatService.newMessageArrived(senderId, message, new Date(time));
    });

    this.chatServiceSub = this.chatService.newMessageReceived$.subscribe(message => {
      this.messages.push(message);
    });

    this.gameHubService.onGameRequestReceived(() => {
      this.openRequestPopup(this.invitationModal!);
    });

    //maybe unsubscribe this subscription
    this.gameRequestSub = this.gameRequestService.gameRequestSent$.subscribe(value => {
      if (value)
        this.openWaitingPopup(this.waitingModal!);
      else
        this.gameRequestService.waitingModalRef?.close();
    });
  }

  /**
   * Sends a message to the other user.
   */
  sendMessage() {
    if (this.messageInput.trim()) {
      this.chatSignalRService.sendMessage(this.chatParticipants.sender.id, this.groupName, this.messageInput);
      this.messageInput = "";
    }
  }

  /**
   * Checks if the message was sent by the current user.
   * @param message The message received.
   * @returns true if the message was sent by the current user, false otherwise.
   */
  isMessageSentByCurrentUser(message: Message) {
    if (message.senderId === this.chatParticipants.sender.id)
      return true;
    return false;
  }

  /**
   * Handles the message that was sent by the current user and adds it to the messages array.
   * @param message the sent message.
   */
  /*private handleSentMessage(message: Message) {
    if (message.senderId !== this.chatParticipants.sender.id) {
      this.messages.push(message);
    }
    this.messages.push(message);
  }*/

  /**
   * Opens a popup window, informs the recipient user that the sender invites him to play.
   * @param content the content of the popup window.
   */
  openRequestPopup(content: TemplateRef<any>) {
    this.gameRequestService.invitationModalRef = this.modal.open(content);
  }

  /**
   * Opens a popup window of a waiting message, displayed to the sender.
   * @param content the content of the popup window.
   */
  openWaitingPopup(content: TemplateRef<any>) {
    this.gameRequestService.waitingModalRef = this.modal.open(content);
  }

  /**
   * Accepts the game request.
   * @param modal the popup modal.
   */
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

  /**
   * Sends a game request, navigates to checkers game component and add query parameters of the users and their turns.
   */
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

  /**
   * Declines a game request.
   */
  declineGameRequest() {
    this.gameRequestService.closeModals();
    this.gameRequestService.setGameRequest(false);
    this.gameRequestService.setRequestAccepted(false);
  }

  ngOnDestroy(): void {
    this.sharedDataServiceSub.unsubscribe();
    this.chatServiceSub.unsubscribe();
    this.gameRequestSub.unsubscribe();
    this.chatSignalRService.unregisterReceiveMessage();
    this.chatSignalRService.leaveGroup(this.groupName);
  }
}