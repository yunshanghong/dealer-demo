import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPasswordUpdateReq } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

const matchValues = (matchTo: string): (AbstractControl) => ValidationErrors | null => {
    return (control: AbstractControl): ValidationErrors | null => {
		return control && control.parent && control.value === control.parent.value[matchTo] ? null : { isMatching: false }
    };
}

@Component({
	selector: 'app-changePassword',
	templateUrl: './changePassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit{

	showOldPWD: boolean = false;
	showNewPWD: boolean = false;
	showConfirmPWD: boolean = false;
    pwdForm: FormGroup;
	changeMsg: string = null;
	showConfirmModal: boolean = false;

	constructor(
        private apiService: ApiService,
		private router: Router,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);
	}
    
	ngOnInit(){

		const pwdRule = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/
		this.pwdForm = new FormGroup({
            "oldPwd": new FormControl(null, [Validators.required]),
            "newPwd": new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(pwdRule)]),
            "confirmPwd": new FormControl(null, [Validators.required, matchValues("newPwd")]),
        })
    }

	onSubmit(){
		const req: UserPasswordUpdateReq ={
			oldPassword: this.pwdForm.get("oldPwd").value,
			newPassword: this.pwdForm.get("newPwd").value,
		}
		this.apiService.UpdatePassword(req)
		.subscribe(() =>{
			super.showPopInfo = {
				timer: setTimeout(() => {
                    this.router.navigate(["personalInfo"]);
				}, 4000),
				popmsg: "Your password has been saved successfully!",
				successFunc: () => {
                    this.router.navigate(["personalInfo"]);
				},
			}
		},
		(err: HttpErrorResponse) => {
			super.errorPopup(err);
			this.pwdForm.markAsUntouched();
		});
	}

	onCancel(){
		if(this.pwdForm.get("oldPwd").value ||
			this.pwdForm.get("newPwd").value ||
			this.pwdForm.get("confirmPwd").value
		){
			this.showConfirmModal = true;
		}else{
			this.onNavPersonalInfo();
		}
	}

	onNavPersonalInfo(){
		this.router.navigate(["/personalInfo"])
	}

}
