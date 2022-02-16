import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: []
})
export class LoaderComponent{
    @Input() isActive: boolean = true;
}
