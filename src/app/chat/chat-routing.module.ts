import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateGuard } from '../guards/authenticate.guard';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {path: '', canActivate:[AuthenticateGuard], component:ChatComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
