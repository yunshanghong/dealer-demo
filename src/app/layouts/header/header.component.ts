import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SearchBarInfo, User } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styles: [`/deep/ .mat-date-range-input-container { height: 100%; }`],
})
export class HeaderComponent implements OnInit{

	currRoute: string = null;
	user: User = null;
	showSearch: boolean = false;
	searchBarInfo: SearchBarInfo = {
		orderNumber: null,
		applicationDateFromUtc: null,
		applicationDateToUtc: null,
		applicantName: null,
	};

	constructor(
        private router: Router,
        private apiService: ApiService,
		private userService: UserService,
		private searchService: SearchService,
	) { }

	ngOnInit(){
		this.router.events.subscribe(() => {
			this.currRoute = this.router.url;
		})
		this.userService.userChange.subscribe((user: User) =>{
			this.user = user;
			if(!user || !user.accessToken){
				this.router.navigate(["login"]);
			}
		})
	}

	logout(){
		this.apiService.UserLogout()
		this.userService.currentUser = null;
		this.router.navigate(["login"]);
	}

	onSearch(){
		this.searchService.onSearch(this.searchBarInfo);
	}
}
