import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html'
})
export class BaseComponent implements AfterViewInit, OnDestroy{

    constructor(
        
    ) { }
        
    ngAfterViewInit() {
    }

    ngOnDestroy() {
        console.log('ngOnDestroy')
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
	}
}
