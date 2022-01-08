import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-forgetPassword',
	templateUrl: './forgetPassword.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class ForgetPasswordComponent extends BaseComponent implements OnInit{
	
	constructor(private router: Router) {
		super();
		console.log("constructor")		
	}

    ngOnInit(){
		console.log("ngOnInit")		
    }

}
