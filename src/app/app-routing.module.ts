import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckersComponent } from './checkers/checkers/checkers.component';
import { ChatComponent } from './components/chat/chat.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthenticateGuard } from './guards/authenticate.guard';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'signin', component:SignInComponent},
  {path: 'signup', component:SignUpComponent},
  {path: 'contacts', canActivate:[AuthenticateGuard], component:ContactsComponent},
  {path: 'chat', canActivate:[AuthenticateGuard], component:ChatComponent},
  {path: 'checkers', canActivate:[AuthenticateGuard], component:CheckersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
