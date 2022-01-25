import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    submitMsg: string = null;

	constructor(
        private apiService: ApiService,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);		
	}

    ngOnInit(){
		const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
		this.forgetPwdForm = new FormGroup({
            "userName": new FormControl(null, [Validators.required]),
            "email": new FormControl(null, [Validators.required, Validators.email, Validators.pattern(emailRule)]),
        })
    }

	onSubmit(){
		const req: UserPasswordForgetReq = {
			username: this.forgetPwdForm.get("userName").value,
			email: this.forgetPwdForm.get('email').value
        }

        this.apiService.UserPasswordForget(req)
		.subscribe((resp: UserPasswordForgetResp) => {
			this.submitMsg = resp.message;
			this.forgetPwdForm.markAsUntouched();
		},
		(err: HttpErrorResponse) => {
			this.submitMsg = err.error.details || err.message || "Forget Password Submit Failed.";
			this.forgetPwdForm.markAsUntouched();
		});

	}
}
