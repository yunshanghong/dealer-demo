import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
        private router: Router
    ) {
        super();
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
