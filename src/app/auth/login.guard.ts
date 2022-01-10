import { Injectable } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

const whiteListUrl = {
    "/login": true,
    "/forgetPassword": true,
};


@Injectable()
export class LoginGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router,) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.userService.currentUser;
        if( whiteListUrl[state.url] || (user.accessToken && user.userName)){
            return true;
        }

        this.router.navigate(['login']);
        return false;
    }
}
