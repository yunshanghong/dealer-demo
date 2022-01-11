import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/api.model';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-personalInfo',
	templateUrl: './personalInfo.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class PersonalInfoComponent extends BaseComponent implements OnInit{

    infoForm: FormGroup;
	user: User;

	constructor(
		private userService: UserService,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);
	}

	ngOnInit(){
		console.log(this.userService.currentUser);
		this.userService.userChange.subscribe((user: User) =>{
			this.user = user;
			this.infoForm.setValue({
				userName: user.userName,
				email: user.email,
				mobile: user.mobile,
			})
		})
		
		this.user = this.userService.currentUser;

		this.infoForm = new FormGroup({
            "userName": new FormControl(this.user.userName, [Validators.required]),
            "email": new FormControl(this.user.email, [Validators.required]),
            "mobile": new FormControl(this.user.mobile, [Validators.required]),
        });

    }

	onSubmit(){

	}
}
