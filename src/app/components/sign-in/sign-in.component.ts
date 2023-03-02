import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from 'src/app/hubServices/chatSignalR/chatSignalR.service';
import { ContactsSignalRService } from 'src/app/hubServices/contactsSignalR/contactsSignalR.service';
import { LoginRequest } from 'src/app/models/login-request.model';
import { AccountService } from 'src/app/services/account/account.service';
import { AppState } from 'src/app/state/app.state';
import * as UsersSelectors from 'src/app/state/users.selectors';
import * as UsersActions from '../../state/users.actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: LoginRequest = new LoginRequest('', '', false);
  subscription!: Subscription;
  showErrorMessage: [boolean, string] = [false, ''];

  constructor(private accountService: AccountService, private contactsSignalRService: ContactsSignalRService, private router: Router,
    private chatSignalRService: ChatSignalRService, private store: Store<AppState>) { 
      this.store.pipe(select(UsersSelectors.usersSelector));
    }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  /**
   * Submits the login form and if successful navigates to {@link ContactsComponent}.
   */
  submitLogin() {
    this.showErrorMessage = [false, ''];
    this.accountService.login(this.loginForm).subscribe({
      next: data => {
        this.contactsSignalRService.newLogin(this.loginForm.username);
        this.chatSignalRService.startConnection(); //if a user refreshes the page, meybe call this function again in ngOnInit only if a token exists
        this.router.navigate(['/contacts']);
      },
      error: (err: HttpErrorResponse) => {
        this.showErrorMessage = [true, err.error];
      }
    });
  }
}