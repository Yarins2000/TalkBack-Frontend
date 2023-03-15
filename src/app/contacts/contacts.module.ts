import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ToastsContainer } from "../toast/toasts-container.component";

@NgModule({
    declarations: [
        ContactsComponent
    ],
    imports: [
        CommonModule,
        ContactsRoutingModule,
        ToastsContainer
    ]
})
export class ContactsModule { }
