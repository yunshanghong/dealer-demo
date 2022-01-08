import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-changePassword',
	templateUrl: './changePassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit{

	constructor() {
		super();
		
	}
    
	ngOnInit(){

    }
}
