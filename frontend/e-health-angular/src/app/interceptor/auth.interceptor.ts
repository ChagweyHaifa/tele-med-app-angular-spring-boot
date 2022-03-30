import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // intercept the request and change it
  // it will intercept some particular routes to add the JWT

  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    // eliminating some routes
    if (httpRequest.url.includes(`${this.authenticationService.host}/login`)) {
      // passing the httpRequest to the handler to continu his route
      return httpHandler.handle(httpRequest);
    }
    if (
      httpRequest.url.includes(`${this.authenticationService.host}/register`)
    ) {
      return httpHandler.handle(httpRequest);
    }

    if (
      httpRequest.url.includes(
        `${this.authenticationService.host}/user/management`
      )
    ) {
      return httpHandler.handle(httpRequest);
    }
    // if (httpRequest.url.includes(`${this.authenticationService.host}/resetpassword`)) {
    //   return httpHandler.handle(httpRequest);
    // }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    // the httpRequest (original request) is mutable we can't modify it, we have to make a clone of it
    const request = httpRequest.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return httpHandler.handle(request);
  }
}