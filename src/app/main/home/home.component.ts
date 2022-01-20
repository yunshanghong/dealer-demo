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
        pageSize: 1,
    }
    totalPage: Array<number> = new Array(1);

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
        this.getOrder();
    }

    onView(id: number){
        console.log(id);

    }

    onPrint(id: number){
        console.log(id);
        this.apiService.OrderPdf(id)
        .subscribe((resp: Blob) =>{
            this.downloadFile(resp, `OrderId_${id}`);
        },
        (err: HttpErrorResponse)=>{
            console.log(err);
        })
    }

    onExport(){
        this.apiService.OrderExport(this.orderInfo)
        .subscribe((resp: Blob) =>{
            this.downloadFile(resp, `Orders_${moment().format("YYYYMMDDHHmmss")}`);
        },
        (err: HttpErrorResponse)=>{
            console.log(err);
        })
    }

    onChangePage(pageIndex: number){
        if (pageIndex !== this.orderInfo.pageIndex && pageIndex >=0 && pageIndex <= this.totalPage.length-1){
            this.orderInfo = {...this.orderInfo, pageIndex: pageIndex};
            this.getOrder();
        }
    }

    private getOrder(){
        this.apiService.OrderFilter(this.orderInfo)
        .subscribe((resp: OrderFilterResp)=>{
            console.log(resp)
            this.orderItems = resp.items;
            this.totalPage = new Array(resp.totalPages).fill(0);
        },
        (err: HttpErrorResponse) => {
            console.log(err)
        })
    }

    private downloadFile(data: Blob, fileName: string){
        const binaryData = [data];
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: data.type}));
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
    }
}
