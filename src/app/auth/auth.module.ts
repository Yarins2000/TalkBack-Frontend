import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastsContainer } from "../toast/toasts-container.component";

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        ToastsContainer
    ]
})
export class AuthModule { }
