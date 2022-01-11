import { Component, OnInit } from '@angular/core';
import { UserProfileResp } from './interfaces/api.model';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: []
})
export class AppComponent implements OnInit{
	constructor(
		private userService: UserService,
		private apiService: ApiService,
	) {
		
	}

	ngOnInit(){
		if(this.userService.currentUser.accessToken){
			this.apiService.UserProfile().subscribe((resp: UserProfileResp)=>{
				console.log(resp)
				this.userService.currentUser = 
				{
					...this.userService.currentUser,
					userName: resp.username,
					name: resp.name,
					email: resp.email,
					mobile: resp.mobile,
				}
			})
		}
	}
}
