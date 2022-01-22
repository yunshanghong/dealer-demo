import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderByIdResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-preview',
	templateUrl: './preview.component.html',
	styleUrls: ["../../../styles/preview.css"]
})
export class PreviewComponent extends BaseComponent implements OnInit{

    orderInfo: OrderByIdResp
    // = {
    //     id: 1,
    //     orderNumber: "string",
    //     customerType: "string",
    //     vehicleCondition: "string",
    //     vehicleType: "string",
    //     brand: "string",
    //     vehicleModelCode: "string",
    //     vehicleModelName: "string",
    //     vehicleVariantCode: "string",
    //     vehicleVariantName: "string",
    //     hasAdditionalStructure: true,
    //     priceWithGst: 10000,
    //     financedAmount: 20000,
    //     interest: 30000,
    //     tenure: 40000,
    //     monthlyInstallment: 50000,
    //     customer: null,
    //     guarantor: null,
    //     vehicleNumber: "string",
    //     supportingDocs: []
    // };

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
        private apiService: ApiService,
        private route: ActivatedRoute,
    ) { 
        super(platformId);
    }

    ngOnInit(){
        const id = this.route.snapshot.params["id"];

        this.apiService.OrderById(id)
        .subscribe((resp: OrderByIdResp)=>{
            console.log(resp);
            this.orderInfo = resp;
        },
        (err: HttpErrorResponse)=>{
            console.log(err)
        })

    }
        
}
