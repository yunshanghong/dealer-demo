import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { UserLoginReq, UserLoginResp, UserProfileResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class LoginComponent extends BaseComponent implements OnInit{

    loginForm: FormGroup;
    showPWD: boolean = false;
    loginErr: string = null;

    constructor(
        @Inject(PLATFORM_ID) public platformId: Object,
        private apiService: ApiService,
        private userService: UserService,
    ) { 
        super(platformId);
    }

    ngOnInit() {
        console.log(this.userService.currentUser);
        this.loginForm = new FormGroup({
            "account": new FormControl("admin", [Validators.required]),
            "password": new FormControl("TfsFc@dm1n", [Validators.required]),
            "RmbMe": new FormControl(this.userService.currentUser.rememberMe, []),
        })
    }

    onLogin(){
        console.log("submit")
        const req: UserLoginReq = {
            username: this.loginForm.get('account').value,
            password: this.loginForm.get('password').value,
        }

        this.apiService.UserLogin(req).pipe(
            mergeMap((loginResp: UserLoginResp) => {
                console.log(loginResp);
                console.log(this.loginForm.get("RmbMe").value);
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
            console.log(profileResp);
            this.userService.currentUser = 
            {
                ...this.userService.currentUser,
                userName: profileResp.username,
                name: profileResp.name,
                email: profileResp.email,
                mobile: profileResp.mobile,
            }
            isPlatformBrowser(this.platformId) && window.location.replace("/");
        },
        (err: HttpErrorResponse) =>{
            this.loginErr = err.message || "Login Failed. Your username and/or password do not match.";
            this.loginForm.get('account').markAsUntouched();
            this.loginForm.get('password').markAsUntouched();
            console.log(err);
        })
    }
}
