import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactsSignalRService } from './hubServices/contactsSignalR/contactsSignalR.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private contactsSignalRService: ContactsSignalRService) { }

  ngOnInit(): void {
    window.addEventListener("keyup", this.disableF5);
    window.addEventListener("keydown", this.disableF5);
  }

  disableF5(e: KeyboardEvent) {
    if ((e.key) === "F5") e.preventDefault();
  };

  ngOnDestroy(): void {
    this.contactsSignalRService.stopConnection();
  }
}
