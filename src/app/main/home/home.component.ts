import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ["../../../styles/index.css"]
})
export class HomeComponent extends BaseComponent implements OnInit, AfterViewInit{

    isAnimated: boolean = false;

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) public platformId: Object,
    ) {
        super(platformId);
    }

    @HostListener('window:load', [])
    onWindowLoad() {
        console.log("load")
        this.isAnimated = true;
    }

    ngOnInit(){
        console.log("ngOnInit");
    }

    ngAfterViewInit(){
        console.log("ngAfterViewInit");
        
    }

}