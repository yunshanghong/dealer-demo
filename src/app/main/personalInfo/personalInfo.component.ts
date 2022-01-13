import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateProfileReq, User } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
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
        private apiService: ApiService,
        @Inject(PLATFORM_ID) public platformId: Object,
	) {
		super(platformId);
	}

	ngOnInit(){
		console.log(this.userService.currentUser);
		this.userService.userChange.subscribe((user: User) =>{
			this.user = user;
			this.infoForm.setValue({
				name: user.name,
				email: user.email,
				mobile: user.mobile,
			})
		})
		
		this.user = this.userService.currentUser;
		const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		this.infoForm = new FormGroup({
            "name": new FormControl(this.user.name, [Validators.required, Validators.minLength(3)]),
            "email": new FormControl(this.user.email, [Validators.required, Validators.email, Validators.pattern(emailRule)]),
            "mobile": new FormControl(this.user.mobile, [Validators.required]),
        });

    }

	onSubmit(){
		const req: UpdateProfileReq ={
			name: this.infoForm.get('name').value,
			email: this.infoForm.get('email').value,
			mobile: this.infoForm.get('mobile').value,
		}
		this.apiService.UpdateProfile(req).subscribe(()=>{
			this.userService.currentUser = {
				...this.userService.currentUser,
				name: req.name,
				email: req.email,
				mobile: req.mobile,
			}
			// TODO: open modal 
			console.log("OKOK")
		},
		(err) =>{
			// TODO: give msg
			console.log("err")
		})
	}

	onCancel(){
		// TODO: check if data is changed
		
		// TODO: open modal


	}
}
