import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../interfaces/api.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    /* UserInfo */
    private userName: string;
    private email: string;
    private name: string;
    private mobile: string;
    
    public userChange: Subject<User> = new Subject<User>();

    get currentUser(): User{
        return { 
            userName: this.userName, 
            email: this.email,
            name: this.name,
            mobile: this.mobile,
            accessToken: isPlatformBrowser(this.platformId) && (sessionStorage.getItem("dealer_token") || localStorage.getItem("dealer_token")),
        }
    }

    set currentUser(user: User){
        console.log(user);
        this.userName = user && user.userName ? user.userName : null;
        this.email = user && user.email ? user.email : null;
        this.name = user && user.name ? user.name : null;
        this.mobile = user && user.mobile ? user.mobile : null;
        if(user && user.accessToken && isPlatformBrowser(this.platformId)){
            user.rememberMe ? localStorage.setItem("dealer_token", user.accessToken) : sessionStorage.setItem("dealer_token", user.accessToken);
        }else{
            localStorage.removeItem("dealer_token");
            sessionStorage.removeItem("dealer_token");
        }
        console.log(this.currentUser);
        this.userChange.next(this.currentUser);
    }

}
