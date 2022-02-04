import { Component, OnInit} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { SearchBarInfo, User } from 'src/app/interfaces/api.model';
import { DATE_FORMATS } from 'src/app/interfaces/date.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { SearchService } from 'src/app/services/search.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},
    	{provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
	]
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
			!user && this.router.navigate(["login"]);
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
