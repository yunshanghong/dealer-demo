import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../interfaces/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {

    /* UserName */
    private userName: string;
    
    public userChange: Subject<User> = new Subject<User>();

    get currentUser(): User{
        return { userName: this.userName, accessToken: localStorage.getItem("dealer_token") }
    }

    set currentUser(user: User){
        this.userName = user && user.userName ? user.userName : null;

        user && user.accessToken ? localStorage.setItem("dealer_token", user.accessToken) : localStorage.removeItem("dealer_token");
        this.userChange.next(this.currentUser);
    }

}
