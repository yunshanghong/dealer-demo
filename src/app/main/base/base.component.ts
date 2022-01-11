import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html'
})
export class BaseComponent implements OnDestroy{

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
    ) { 
        
    }
        
    ngOnDestroy() {
        console.log('ngOnDestroy')
        isPlatformBrowser(this.platformId) && window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
	}
}
