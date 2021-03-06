import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgPupup } from 'src/app/interfaces/common.model';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
})
export class BaseComponent implements OnDestroy {
    isActive = true;

    showPopInfo: MsgPupup = {
        timer: null,
        popmsg: null,
        successFunc: null,
    };

    constructor(@Inject(PLATFORM_ID) protected platformId: object) {}

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        }
    }

    protected downloadFile(data: Blob, fileName: string): void {
        const binaryData = [data];
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: data.type })
        );
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
    }

    protected unactiveLoader(): void {
        this.isActive = false;
    }

    protected activeLoader(): void {
        this.isActive = true;
    }

    protected errorPopup(error: HttpErrorResponse): void {
        console.log(error);
        const msg = error?.error?.errors
            ? error.error.errors[Object.keys(error.error.errors)[0]][0]
            : error.error.details || error.message;
        this.showPopInfo = {
            timer: setTimeout(() => {
                this.showPopInfo = {
                    timer: null,
                    popmsg: null,
                    successFunc: null,
                };
            }, 4000),
            popmsg: msg,
            successFunc: null,
        };
    }
}
