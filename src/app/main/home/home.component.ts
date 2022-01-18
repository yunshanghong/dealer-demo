import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { OrderFilterReq, OrderFilterResp, OrderItem } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ["../../../styles/index.css"]
})
export class HomeComponent extends BaseComponent implements OnInit{

    isAnimated: boolean = false;
    orderItems: Array<OrderItem> = [];
    pageIndex: number = 0;
    

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
        const req: OrderFilterReq ={
            orderNumber: null,
            applicationDateFromUtc: null,
            applicationDateToUtc: null,
            applicantName: null,
            status: null,
            pageIndex: 0,
            pageSize: 10,
        }

        this.apiService.OrderFilter(req)
        .subscribe((resp: OrderFilterResp)=>{
            console.log(resp)
            this.orderItems = resp.items;
        },
        (err: HttpErrorResponse) => {
            console.log(err)
        })
    }
}
