import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  helper = new JwtHelperService();

  constructor() { }

  isLoggedIn(): boolean {
    const token = this.getToken("token");
    return token !== null && !this.helper.isTokenExpired(token);
  }

  getToken(tokenName: string): string | null {
    return sessionStorage.getItem(tokenName);
  }

  setToken(tokenName: string, tokenValue: string): void {
    sessionStorage.setItem(tokenName, tokenValue);
  }

  removeToken(tokenName: string): void {
    sessionStorage.removeItem(tokenName);
  }

  getUsernameFromToken(tokenName: string): string {
    const token = this.getToken(tokenName);
    if(!token)
      return '';
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken.given_name;
  }
}
