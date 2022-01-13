import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPasswordUpdateReq } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-changePassword',
	templateUrl: './changePassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit{

    pwdForm: FormGroup;

	constructor(
        private apiService: ApiService,
		private router: Router,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);
	}
    
	ngOnInit(){

		this.pwdForm = new FormGroup({
            "oldPwd": new FormControl(null, [Validators.required]),
            "newPwd": new FormControl(null, [Validators.required]),
            "confirmPwd": new FormControl(null, [Validators.required]),
        })
    }

	onSubmit(){
		const req: UserPasswordUpdateReq ={
			oldPassword: this.pwdForm.get("oldPwd").value,
			newPassword: this.pwdForm.get("newPwd").value,
		}
		this.apiService.UpdatePassword(req).subscribe(() =>{
			
		});
	}

}
