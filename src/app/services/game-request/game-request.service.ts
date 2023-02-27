import { Injectable } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameRequestService {
  private gameRequestSent = new Subject<boolean>();
  private requestAccepted = new Subject<boolean>();
  invitationModalRef?: NgbModalRef;
  waitingModalRef?: NgbModalRef;

  constructor() { }

  get gameRequestSent$() {
    return this.gameRequestSent.asObservable();
  }
  setGameRequest(value: boolean) {
    this.gameRequestSent.next(value);
  }

  get requestAccepted$() {
    return this.requestAccepted.asObservable();
  }
  setRequestAccepted(value: boolean) {
    this.requestAccepted.next(value);
  }

  closeModals(){
    this.invitationModalRef?.close();
    this.waitingModalRef?.close();
  }
}
