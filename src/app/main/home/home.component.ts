import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { OrderReq, OrderFilterResp, OrderItem, SearchBarInfo } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from 'src/app/services/search.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ["../../../styles/index.css"]
})
export class HomeComponent extends BaseComponent implements OnInit{

    createBtns: Array<string> = ["New PC", "New CV", "Used PC", "Used CV"]; 
    searchTabs: Array<string> = ["Approved", "Pending Approval", "Declined", "Draft", "Canceled", "Pending MyInfo"]
    addAnimate: boolean = true;
    orderItems: Array<OrderItem> = [];
    orderInfo: OrderReq = {
        orderNumber: null,
        applicationDateFromUtc: null,
        applicationDateToUtc: null,
        applicantName: null,
        status: [],
        pageIndex: 0,
        pageSize: 10,
        sortRequest: null,
    }
    totalPage: Array<number> = new Array(1);

    constructor(
        private apiService: ApiService,
        private router: Router,
		private searchService: SearchService,
        @Inject(PLATFORM_ID) public platformId: Object,
    ) {
        super(platformId);
    }

    ngOnInit(){
        this.searchService.getEmitter()
        .subscribe((searchInfo: SearchBarInfo) => {
            this.orderInfo = {
                ... this.orderInfo, 
                ... searchInfo,
                applicationDateToUtc: moment(searchInfo.applicationDateToUtc).add(1, "day").toDate(),
                pageIndex: 0,
            };
            this.getOrder();
        })
        setTimeout(() => {
            this.addAnimate = false;
        }, 500);

        this.getOrder();
    }

    onView(id: number){
        this.router.navigate([`preview/${id}`])
    }

    onPrint(id: number){
        this.apiService.OrderPdf(id)
        .subscribe((resp: Blob) =>{
            isPlatformBrowser(this.platformId) && super.downloadFile(resp, `OrderId_${id}`);
        },
        (err: HttpErrorResponse)=>{
            console.log(err);
        })
    }

    onExport(){
        this.apiService.OrderExport(this.orderInfo)
        .subscribe((resp: Blob) =>{
            isPlatformBrowser(this.platformId) && super.downloadFile(resp, `Orders_${moment().format("YYYYMMDDHHmmss")}`);
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

    onChangeStatus(status: string){
        const newStatus = [];
        status && newStatus.push(status);
        this.orderInfo.status = newStatus;
        this.orderInfo.pageIndex = 0;
        this.getOrder();
    }

    onChangeSort(sortKey: string){
        this.orderInfo.pageIndex = 0;
        if(this.orderInfo.sortRequest?.key === sortKey){
            this.orderInfo.sortRequest = { ...this.orderInfo.sortRequest, isAscending: !this.orderInfo.sortRequest?.isAscending };
        }else{
            this.orderInfo.sortRequest = { key: sortKey, isAscending: false };
        }
        this.getOrder();
    }

    private getOrder(){
        this.apiService.OrderFilter(this.orderInfo)
        .subscribe((resp: OrderFilterResp)=>{
            this.orderItems = resp.items;
            this.totalPage = new Array(resp.totalPages).fill(0);
            super.unactiveLoader();
        },
        (err: HttpErrorResponse) => {
            console.log(err)
        })
    }
}
