import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-personalInfo',
	templateUrl: './personalInfo.component.html',
	styleUrls: ["../../../styles/login.css"]
})
export class PersonalInfoComponent extends BaseComponent implements OnInit{
	constructor() {
		super();
		
	}

	ngOnInit(){

    }
}
