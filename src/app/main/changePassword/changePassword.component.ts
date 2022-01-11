import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-changePassword',
	templateUrl: './changePassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit{

    pwdForm: FormGroup;

	constructor(
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

}
