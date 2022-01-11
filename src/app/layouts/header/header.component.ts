import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { User, UserProfileResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: []
})
export class HeaderComponent implements OnInit{

	user: User = null;

	constructor(
        private router: Router,
        private apiService: ApiService,
		private userService: UserService,
	) { }

	ngOnInit(){
		console.log(this.userService.currentUser);

		this.userService.userChange.subscribe((user: User) =>{
			this.user = user;
		})

		
	}

	logout(){
		this.apiService.UserLogout().subscribe(
		() => {},
		() => {},
		() => {
			this.userService.currentUser = null;
			this.router.navigate(["login"]);
		});
	}
}
