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

    orderInfo: OrderByIdResp;

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
