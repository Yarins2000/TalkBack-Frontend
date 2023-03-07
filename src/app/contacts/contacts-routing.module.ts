import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateGuard } from '../guards/authenticate.guard';
import { ContactsComponent } from './components/contacts/contacts.component';

const routes: Routes = [
    {path: 'contacts', canActivate:[AuthenticateGuard], component:ContactsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
