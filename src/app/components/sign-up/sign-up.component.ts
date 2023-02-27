import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { Register } from 'src/app/models/register.model';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  regExPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  registerForm = new Register('', '', '');
  isPasswordNotMatch = false;
  showErrorMessage: [boolean, string] = [false, ''];

  constructor(private accountService: AccountService, private router: Router) { }

  matchPassword() {
    this.isPasswordNotMatch = this.registerForm.password !== this.registerForm.confirmPassword;
  }

  submitSignUp() {
    this.showErrorMessage = [false, ''];
    this.accountService.register(this.registerForm).subscribe({
      next: data => {
        this.router.navigate(['/signin']);
      },
      error: err => {
        this.showErrorMessage = [true, err.error];
      }
    });
  }
}
