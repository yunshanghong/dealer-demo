import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetail } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-preview',
	templateUrl: './preview.component.html',
	styleUrls: ["../../../styles/preview.css"]
})
export class PreviewComponent extends BaseComponent implements OnInit{

    id: number;
    orderInfo: OrderDetail;
    generalDocsLimit: number = 6;

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
    ) { 
        super(platformId);
        this.orderInfo = this.router.getCurrentNavigation()?.extras?.state?.orderInfo;
    }

    ngOnInit(){
        this.id = this.route.snapshot.params["id"];

        this.apiService.OrderById(this.id)
        .subscribe((resp: OrderDetail)=>{
            console.log(resp);
            this.orderInfo = resp;
            super.unactiveLoader();
        },
        (err: HttpErrorResponse)=>{
            console.log(err)
        })
    }

    onEdit(){
        this.router.navigate(['create-update', this.id], {
            state: { orderInfo: this.orderInfo }
        })
    }

    onDownload(){
        this.apiService.OrderPdf(this.id)
        .subscribe((resp: Blob) =>{
            isPlatformBrowser(this.platformId) && super.downloadFile(resp, `OrderId_${this.id}`);
        },
        (err: HttpErrorResponse)=>{
            console.log(err);
        })
    }

    onSubmit(){
        this.apiService.OrderSubmit(this.id)
        .subscribe(()=>{
            console.log("OKOK")
        },
        (error: HttpErrorResponse) => {
            super.errorPopup(error);
        })
    }
}
