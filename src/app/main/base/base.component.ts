import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html'
})
export class BaseComponent implements OnDestroy{

    isActive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
    ) { }
        
    ngOnDestroy() {
        isPlatformBrowser(this.platformId) && window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
	}

    protected downloadFile(data: Blob, fileName: string){
        const binaryData = [data];
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: data.type}));
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
    }

    protected unactiveLoader(){
        this.isActive = false;
    }
}
