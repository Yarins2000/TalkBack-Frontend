import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Register } from '../../models/register.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from 'src/app/models/login.model';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountUrl = environment.serverApi + environment.account;

  helper = new JwtHelperService();

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  Login(login: Login): Observable<any> {
    return this.http.post(this.accountUrl + "login", login);
  }

  login(login: Login): Observable<{result: any, user: any, token: string}>{
    return this.http.post<{result: any, user: any, token: string}>(this.accountUrl + "login", login).pipe(map((response) => {
      const decodedToken = this.helper.decodeToken(response.token); // maybe delete
      this.tokenService.setToken("token", response.token);
      return response.user;
    }));
  }

  register(register: Register): Observable<any> {
    return this.http.post(this.accountUrl + "register", register);
  }

  logout(){
    let username = this.tokenService.getUsernameFromToken("token");
    this.tokenService.removeToken("token");
    return this.http.post<void>(this.accountUrl + "logout", {username});
  }
}
