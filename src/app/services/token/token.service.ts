import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  helper = new JwtHelperService();

  constructor() { }

  /**
   * Checks if there is a logged in user by trying get the token from session storage.
   * @returns true if there is a logged in user, false otherwise.
   */
  isLoggedIn(): boolean {
    const token = this.getItemFromSessionStorage("token");
    return token !== null && !this.helper.isTokenExpired(token);
  }

  /**
   * Gets a token from session storage
   * @param itemKey the name of the token
   * @returns the token from session storage, if not exists null.
   */
  getItemFromSessionStorage(itemKey: string): string | null {
    return sessionStorage.getItem(itemKey);
  }

  /**
   * Sets a new item in session storage.
   * @param itemKey the item's key
   * @param itemValue the item's value
   */
  setNewItemInSessionStorage(itemKey: string, itemValue: string): void {
    sessionStorage.setItem(itemKey, itemValue);
  }

  removeItemFromSessionStorage(itemKey: string): void {
    sessionStorage.removeItem(itemKey);
  }

  /**
   * Gets the username from a token (if exists).
   * @param tokenName the token name
   * @returns the username received from the token.
   */
  getUsernameFromToken(tokenName: string): string {
    const token = this.getItemFromSessionStorage(tokenName);
    if(!token)
      return '';
    const decodedToken = this.helper.decodeToken(token);
    return decodedToken.given_name;
  }
}
