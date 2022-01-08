import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

    /* jwt Token  */
    get accessToken(): string {
        return localStorage.getItem('dealer_token');
    }

    set accessToken(value: string) {
        localStorage.setItem('dealer_token', value);
    }
}
