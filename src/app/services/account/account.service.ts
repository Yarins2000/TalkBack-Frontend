import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../../models/register-request.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest } from 'src/app/models/login-request.model';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountUrl = environment.serverApi + environment.account;

  helper = new JwtHelperService();

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  /**
   * Sends a POST request to the server to login a user with the provided credentials.
   * @param login - An object containing the user's login credentials.
   * @returns An observable that emits the user object and token returned by the server upon successful login.
   */
  login(login: LoginRequest): Observable<{result: any, user: any, token: string}>{
    return this.http.post<{result: any, user: any, token: string}>(this.accountUrl + "login", login).pipe(map(response => {
      this.tokenService.setNewItemInSessionStorage("token", response.token);
      return response.user;
    }));
  }

  /**
   * Sends a POST request to the server to register a user with the provided credentials.
   * @param register An object containing the user's register credentials
   * @returns An observable that emits the answer from the server, if the registration was successful.
   */
  register(register: RegisterRequest): Observable<boolean | undefined> {
    return this.http.post<boolean | undefined>(this.accountUrl + "register", register);
  }

  /**
   * Sends a POST request to the server to logout the current user.
   * @returns an Observable that emits void.
   */
  logout(): Observable<void>{
    let username = this.tokenService.getUsernameFromToken("token");
    this.tokenService.removeItemFromSessionStorage("token");
    return this.http.post<void>(this.accountUrl + "logout", {username});
  }
}
