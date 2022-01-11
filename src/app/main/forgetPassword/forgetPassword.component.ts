import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPasswordForgetReq, UserPasswordForgetResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-forgetPassword',
	templateUrl: './forgetPassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ForgetPasswordComponent extends BaseComponent implements OnInit{
	
    forgetPwdForm: FormGroup;
    submitErrMsg: string = null;

	constructor(
		private router: Router,
        private apiService: ApiService,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);		
	}

    ngOnInit(){
		const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
		this.forgetPwdForm = new FormGroup({
            "account": new FormControl(null, [Validators.required]),
            "email": new FormControl(null, [Validators.required, Validators.email, Validators.pattern(emailRule)]),
        })
    }

	onSubmit(){
		const req: UserPasswordForgetReq = {
			email: this.forgetPwdForm.get('email').value
        }

        this.apiService.UserPasswordForget(req)
			.subscribe((resp: UserPasswordForgetResp) => {
				this.submitErrMsg = resp.message
			},
			(err: HttpErrorResponse) => {
	            this.submitErrMsg = err.message;
			},
			() => {
				this.forgetPwdForm.get('account').markAsUntouched();
				this.forgetPwdForm.get('email').markAsUntouched();
			})

	}
}
