import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderByIdResp } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'app-create-update',
	templateUrl: './create-update.component.html',
	styleUrls: ["../../../styles/create-update.css"]
})
export class CreateUpdateComponent extends BaseComponent implements OnInit{

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
        private apiService: ApiService,
        private route: ActivatedRoute,
    ) { 
        super(platformId);
    }

    ngOnInit(){
        console.log("create-update")

    }
        
}
