import { AfterViewInit, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ["../../../styles/index.css"]
})
export class HomeComponent extends BaseComponent{

    isAnimated: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: Object,
    ) {
        super(platformId);
    }

    @HostListener('window:load', [])
    onWindowLoad() {
        this.isAnimated = true;
    }
}
