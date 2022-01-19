import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { OrderReq, OrderFilterResp, OrderItem } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';
import * as moment from 'moment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ["../../../styles/index.css"]
})
export class HomeComponent extends BaseComponent implements OnInit{

    isAnimated: boolean = false;
    orderItems: Array<OrderItem> = [];
    orderInfo: OrderReq = {
        orderNumber: null,
        applicationDateFromUtc: null,
        applicationDateToUtc: null,
        applicantName: null,
        status: null,
        pageIndex: 0,
        pageSize: 10,
    }
    totalPage: number = 1;

    constructor(
        private apiService: ApiService,
        @Inject(PLATFORM_ID) public platformId: Object,
    ) {
        super(platformId);
    }

    @HostListener('window:load', [])
    onWindowLoad() {
        this.isAnimated = true;
    }

    ngOnInit(){
        this.apiService.OrderFilter(this.orderInfo)
        .subscribe((resp: OrderFilterResp)=>{
            console.log(resp)
            this.orderItems = resp.items;
            this.totalPage = resp.totalPages;
        },
        (err: HttpErrorResponse) => {
            console.log(err)
        })
    }

    onView(id: number){
        console.log(id);

    }

    onPrint(id: number){
        console.log(id);
    }

    onExport(){
        this.apiService.OrderExport(this.orderInfo)
        .subscribe((resp: Blob) =>{
            let dataType = resp.type;
            let binaryData = [];
            binaryData.push(resp);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            downloadLink.setAttribute('download', `Orders_${moment().format("YYYYMMDDHHmmss")}`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        },
        (err: HttpErrorResponse)=>{
            console.log(err);
        })
    }
}
