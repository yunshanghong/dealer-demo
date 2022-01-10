import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserLoginReq, UserLoginResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class LoginComponent extends BaseComponent implements OnInit{

    loginForm: FormGroup;
    showPWD: boolean = false;

    constructor(
        private apiService: ApiService,
        private userService: UserService,
    ) { 
        super();
    }

    ngOnInit() {
        this.loginForm = new FormGroup({
            "account": new FormControl("admin", [Validators.required]),
            "password": new FormControl("TfsFc@dm1n", [Validators.required]),
            "RmbMe": new FormControl(false, []),
        })
    }

    onLogin(){
        console.log("submit")
        const req: UserLoginReq = {
            username: this.loginForm.get('account').value,
            password: this.loginForm.get('password').value,
        }

        this.apiService.UserLogin(req).subscribe((resp: UserLoginResp) =>{
            this.userService.currentUser = 
                { 
                    userName: this.userService.currentUser.userName,  
                    accessToken: `${resp.tokenType} ${resp.accessToken}`
                }
            
        })
    }
}
