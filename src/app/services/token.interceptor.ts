import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
	    private router: Router,
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
			console.log(error);
			if (error.status === 401) {
				this.userService.currentUser = null;
	            this.router.navigate(['login']);
			}
			return throwError(error);
		}));
    }
}
