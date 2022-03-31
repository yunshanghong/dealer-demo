import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { UserLoginReq, UserLoginResp, UserProfileResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class LoginComponent extends BaseComponent implements OnInit{

    loginForm: FormGroup;
    showPWD: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: Object,
        private apiService: ApiService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
    ) { 
        super(platformId);
    }

    ngOnInit() {
        super.unactiveLoader();
        this.loginForm = new FormGroup({
            "account": new FormControl(null, [Validators.required]),
            "password": new FormControl(null, [Validators.required]),
            "RmbMe": new FormControl(true, []),
        })

        const token = this.route.snapshot.queryParams.token;
        if(token){
            super.activeLoader();
            this.userService.currentUser = 
            {
                ...this.userService.currentUser,
                rememberMe: this.loginForm.get("RmbMe").value,
                accessToken: token
            }
            this.apiService.UserProfile()
            .subscribe((profileResp: UserProfileResp) =>{
                this.userService.currentUser = 
                {
                    ...this.userService.currentUser,
                    userName: profileResp.username,
                    name: profileResp.name,
                    email: profileResp.email,
                    mobile: profileResp.mobile,
                }

                const orderid = this.route.snapshot.queryParams.orderid;

                orderid ? this.router.navigate(["/create-update", orderid]) : this.router.navigate(["/"]);
            },
            (err: HttpErrorResponse) =>{
                super.unactiveLoader();
                super.errorPopup(err);
                this.loginForm.markAsUntouched();
            })
        }
    }

    onLogin(){
        super.activeLoader();
        const req: UserLoginReq = {
            username: this.loginForm.get('account').value,
            password: this.loginForm.get('password').value,
        }

        this.apiService.UserLogin(req).pipe(
            mergeMap((loginResp: UserLoginResp) => {
                this.userService.currentUser = 
                {
                    ...this.userService.currentUser,
                    rememberMe: this.loginForm.get("RmbMe").value,
                    accessToken: loginResp.accessToken
                }
                return this.apiService.UserProfile();
            }
        ))
        .subscribe((profileResp: UserProfileResp) =>{
            this.userService.currentUser = 
            {
                ...this.userService.currentUser,
                userName: profileResp.username,
                name: profileResp.name,
                email: profileResp.email,
                mobile: profileResp.mobile,
            }
            this.router.navigate(["/"]);
        },
        (err: HttpErrorResponse) =>{
            super.unactiveLoader();
            super.errorPopup(err);
            this.loginForm.markAsUntouched();
        })
    }
}
