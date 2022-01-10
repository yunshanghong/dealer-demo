import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
		private userService: UserService
	) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return from([this.userService.currentUser.accessToken])
		.pipe(switchMap(token => {
			console.log(token)
			if (token) {
				request = request.clone({
					setHeaders: {
						'Authorization': token
					}
				});
			}

			if (!request.headers.has('Content-Type') && !(request.body instanceof FormData)) {
				request = request.clone({
					setHeaders: {
						'content-type': 'application/json'
					}
				});
			}

			request = request.clone({
				headers: request.headers.set('Accept', 'application/json')
			});

			console.log(request);
			return next.handle(request);
		}),

		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				this.userService.currentUser = null;
			}
			return throwError(error);
		}));
    }
}
