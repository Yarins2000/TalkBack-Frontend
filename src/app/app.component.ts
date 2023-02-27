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
    // this.contactsSignalRService.startConnection();
  }

  ngOnDestroy(): void {
    this.contactsSignalRService.stopConnection();
  }
}
