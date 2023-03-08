import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/auth/models/register-request.model';
import { AccountService } from 'src/app/auth/services/account/account.service';
import { ToastService } from 'src/app/toast/toast.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnDestroy {
  regExPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  registerForm = new RegisterRequest('', '', '');
  isPasswordNotMatch = false;
  showErrorMessage: [boolean, string] = [false, ''];

  constructor(private accountService: AccountService, private router: Router, private toastService: ToastService) { }

  matchPassword() {
    this.isPasswordNotMatch = this.registerForm.password !== this.registerForm.confirmPassword;
  }

  /**
   * Submits the form. if the registration was successful, navigates to {@link SignInComponent}
   */
  submitSignUp() {
    this.showErrorMessage = [false, ''];
    this.accountService.register(this.registerForm).subscribe({
      next: data => {
        this.showSuccessToast();
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
      },
      error: err => {
        this.showErrorMessage = [true, err.error];
      }
    });
  }

  showSuccessToast() {
    this.toastService.show("You've got registration successfully", { classname: 'bg-success text-light', delay: 2000 });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
