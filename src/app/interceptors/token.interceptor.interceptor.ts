import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  /**
   * Intercepts the HTTP requests and adds the bearer token to the Authorization header if a token exists.
   * @param request The HTTP request to be intercepted
   * @param next The HttpHandler to be called after the interception
   * @returns An Observable of HttpEvent<any>
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getItemFromSessionStorage("token");
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(request);
    }
  }
}
