import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Dropdown, DropdownItem, OrderDetail, VehicleBrand } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';
import { Location } from '@angular/common';

@Component({
	selector: 'app-create-update',
	templateUrl: './create-update.component.html',
	styleUrls: ["../../../styles/create-update.css"]
})
export class CreateUpdateComponent extends BaseComponent implements OnInit{

    updateOrder: OrderDetail;
    nations: Array<DropdownItem>;
    residentStatus: Array<DropdownItem>;
    vehicleBrands: Array<VehicleBrand>;
    vehicleForm: FormGroup;
    financeForm: FormGroup;
    customerForm: FormGroup;
    guarantorForm: FormGroup;
    logCardAttach: File;
    salesAttach: File;
    docsAttach: File[];
    guarantorOn: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
    ) { 
        super(platformId);
        this.updateOrder = this.router.getCurrentNavigation()?.extras?.state?.orderInfo
    }

    ngOnInit(){

        this.vehicleForm = new FormGroup({
            "customerType": new FormControl(null, [Validators.required]),
            "vehicleCondition": new FormControl(null, [Validators.required]),
            "vehicleType": new FormControl(null, [Validators.required]),
            "brand": new FormControl(null, [Validators.required]),
            "vehicleModelCode": new FormControl(null, [Validators.required], ),
            "vehicleModelName": new FormControl(null, [Validators.required]),
        })
        
        this.vehicleForm.get("vehicleModelCode").valueChanges
        .subscribe((code)=>{
            this.vehicleForm.patchValue({
                vehicleModelName: 
                    this.vehicleBrands?.find(item => item.brandName === this.vehicleForm.get("brand").value)?.vehicleModels?.find(item => item.code === code)?.name
            })
        })

        this.financeForm = new FormGroup({
            "priceWithGst": new FormControl(null, [Validators.required]),
            "financedAmount": new FormControl(null, [Validators.required]),
            "tenure": new FormControl(null, [Validators.required]),
            "interest": new FormControl(null, [Validators.required]),
            "monthlyInstallment": new FormControl(null, [Validators.required]),
        })

        this.customerForm = new FormGroup({
            "isMyInfo": new FormControl(false, [Validators.required]),
            "name": new FormControl(null, [Validators.required]),
            "gender": new FormControl(null, [Validators.required]),
            "nationality": new FormControl(null, [Validators.required]),
            "residentialStatus": new FormControl(null, [Validators.required]),
            "dateOfBirth": new FormControl(null, [Validators.required]),
            "postalCode": new FormControl(null, [Validators.required]),
            "address": new FormControl(null, [Validators.required]),
            "unitNumber": new FormControl(null, [Validators.required]),
            "mobile": new FormControl(null, [Validators.required]),
            "email": new FormControl(null, [Validators.required]),
            "netAnnualIncome": new FormControl(null, [Validators.required]),
            "employerName": new FormControl(null, [Validators.required]),
            "assessmentYear": new FormControl(null, [Validators.required]),
            "nric": new FormControl(null, [Validators.required]),
        })

        this.guarantorForm = new FormGroup({
            "isMyInfo": new FormControl(null, [Validators.required]),
            "name": new FormControl(null, [Validators.required]),
            "gender": new FormControl(null, [Validators.required]),
            "nationality": new FormControl(null, [Validators.required]),
            "residentialStatus": new FormControl(null, [Validators.required]),
            "dateOfBirth": new FormControl(null, [Validators.required]),
            "postalCode": new FormControl(null, [Validators.required]),
            "address": new FormControl(null, [Validators.required]),
            "unitNumber": new FormControl(null, [Validators.required]),
            "mobile": new FormControl(null, [Validators.required]),
            "email": new FormControl(null, [Validators.required]),
            "netAnnualIncome": new FormControl(null, [Validators.required]),
            "employerName": new FormControl(null, [Validators.required]),
            "assessmentYear": new FormControl(null, [Validators.required]),
            "nric": new FormControl(null, [Validators.required]),
        })

        this.apiService.VehicleBrand()
        .subscribe((resp: Array<VehicleBrand>) =>{
            console.log(resp);
            this.vehicleBrands = resp;
            if(!this.vehicleForm.get('brand').value){
                this.vehicleForm.patchValue({
                    brand: resp[0]?.brandName, 
                    vehicleModelCode: resp[0]?.vehicleModels[0]?.code
                })
            }
        })

        this.apiService.OrderDropdown()
        .subscribe((resp: Array<Dropdown>) =>{
            console.log(resp);
            this.nations = resp.find(item => item.category === "Order.Nationalities")?.items;
            this.residentStatus = resp.find(item => item.category === "Order.ResidentialStatus")?.items;
        })


        const updateId = this.route.snapshot.params["id"];
        // update flow
        if(updateId !== undefined){
            of(this.updateOrder)
            .pipe(
                mergeMap((order: OrderDetail) => 
                    order ? new Observable<OrderDetail>(sub => sub.next(order)) : this.apiService.OrderById(updateId)
                )
            )
            .subscribe((data: OrderDetail) =>{
                console.log(data);
                this.updateOrder = data;
                this.vehicleForm.patchValue({...data});
                this.financeForm.patchValue({...data});
                this.customerForm.patchValue({...data.customer});
                if(data.guarantor){
                    this.guarantorOn = true;
                    this.guarantorForm.patchValue({...data.guarantor});
                }
            })
        }
        // create flow
        else{
            const paramType = this.route.snapshot.queryParams.type;
            let initCustomerType = null;
            let initVehicleCondition = null;
            let initVehicleType = null;
            
            if(paramType === "New PC"){
                initCustomerType = "Individual";
                initVehicleCondition = "New";
                initVehicleType = "PC";
            }else if (paramType === "New CV"){
                initCustomerType = "Corporate";
                initVehicleCondition = "New";
                initVehicleType = "CV";
            }else if (paramType === "Used PC"){
                initCustomerType = "Individual";
                initVehicleCondition = "Used";
                initVehicleType = "PC"
            }else if (paramType === "Used CV"){
                initCustomerType = "Corporate";
                initVehicleCondition = "Used";
                initVehicleType = "CV";
            }

            this.vehicleForm.patchValue({
                customerType: initCustomerType,
                vehicleCondition: initVehicleCondition,
                vehicleType: initVehicleType,
            })
        }
    }
    
    onDiscard(){
        of(this.updateOrder?.id)
        .pipe(
            mergeMap((id: number) => 
                id ? new Observable<void>(sub => sub.next()) : this.apiService.OrderDelete(id)
            )
        )
        .subscribe(() =>{
            this.location.back();
        })
    }

    onSave(){
        of(this.updateOrder?.id)
        .pipe(
            mergeMap((id: number) => {
                const req: OrderDetail = {
                    ...this.vehicleForm.value,
                    ...this.financeForm.value,
                    customer:{
                        ...this.customerForm.value,
                    },
                    guarantor: {
                        ...this.guarantorForm.value,
                    }
                }
                return id ? this.apiService.OrderUpdate(id, req) : this.apiService.OrderCreate(req)
            })
        )
        .subscribe((res) =>{
            this.router.navigate(['/']);
        })
    }

    onPreview(){
        console.log(this.vehicleForm.value)
        console.log(this.customerForm.value)
        console.log(this.guarantorForm?.value)
        console.log(this.logCardAttach);
    }

    onBrandChange(){
        const brandName = this.vehicleForm.get('brand').value;
        const vehicleCode = this.vehicleBrands?.find(item => item.brandName === brandName)?.vehicleModels[0]?.code;
        this.vehicleForm.patchValue({ vehicleModelCode: vehicleCode })
    }

    onSwitchGuarantor(){
        this.guarantorOn = !this.guarantorOn;

        console.log(this.guarantorOn);

        if(this.guarantorOn){
            this.guarantorForm.patchValue({ isMyInfo: false })
        }else{
            this.guarantorForm.reset();
        }
    }

    onDocsAttach(files: FileList){
        this.docsAttach = Array.from(files);
    }
}
