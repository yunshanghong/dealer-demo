import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
		private userService: UserService
	) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const token = this.userService.accessToken;
		const newRequest = token ? request.clone({ setHeaders: {Authorization: token}}) : request;
		return next.handle(newRequest)
    }
}
