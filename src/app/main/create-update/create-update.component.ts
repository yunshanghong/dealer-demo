import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AddressResp, AttachUploadReq, Dropdown, DropdownItem, FileRecord, OrderDetail, VehicleBrand } from 'src/app/interfaces/api.model';
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
    additionalForm: FormGroup;
    financeForm: FormGroup;
    customerForm: FormGroup;
    guarantorForm: FormGroup;
    // file has id => original file
    // file has file => new upload file
    uploadAttachFile: Array<FileRecord> = [];
    // file has id => delete file
    deleteAttachId: Array<FileRecord> = [];
    showSavedPopTimer: any = null;
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

    private conditionRequired = (controlName: string, matchTo: boolean): (AbstractControl) => ValidationErrors | null => {
        return (control: AbstractControl): ValidationErrors | null => {
            if(control && control.parent && control.parent.get(controlName).value === matchTo){
                return control.value ? null : { isMatching: false }
            }
            return null;
        };
    }

    private conditionRequired2 = (controlName: string, matchTo: boolean): (AbstractControl) => ValidationErrors | null => {
        return (control: AbstractControl): ValidationErrors | null => {
            if(this.guarantorOn && control && control.parent && control.parent.get(controlName).value === matchTo){
                return control.value ? null : { isMatching: false }
            }
            return null;
        };
    }


    private conditionRequired3 = (): (AbstractControl) => ValidationErrors | null => {
        return (control: AbstractControl): ValidationErrors | null => {
            if(this.guarantorOn){
                return (control.value !== null && control.value !== "" && control.value !== undefined) ? null : { isMatching: false }
            }
            return null;
        };
    }

    ngOnInit(){

        this.vehicleForm = new FormGroup({
            "customerType": new FormControl(null, [Validators.required]),
            "vehicleCondition": new FormControl(null, [Validators.required]),
            "vehicleType": new FormControl(null, [Validators.required]),
            "brand": new FormControl("", [Validators.required]),
            "vehicleModelCode": new FormControl("", [Validators.required]),
            "vehicleModelName": new FormControl("", [Validators.required]),
        })

        this.additionalForm = new FormGroup({
            "vehicleNumber": new FormControl(null, [Validators.required]),
            "hasAdditionalStructure": new FormControl(null, [Validators.required]),
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
            "nric": new FormControl(null, [Validators.required]),
            "gender": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "nationality": new FormControl("", [this.conditionRequired("isMyInfo", false)]),
            "residentialStatus": new FormControl("", [this.conditionRequired("isMyInfo", false)]),
            "dateOfBirth": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "postalCode": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "address": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "unitNumber": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "mobile": new FormControl(null, [Validators.required]),
            "email": new FormControl(null, [Validators.required]),
            "netAnnualIncome": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "employerName": new FormControl(null, [this.conditionRequired("isMyInfo", false)]),
            "assessmentYear": new FormControl("", [this.conditionRequired("isMyInfo", false)]),
        })

        this.guarantorForm = new FormGroup({
            "isMyInfo": new FormControl(false, [this.conditionRequired3()]),
            "name": new FormControl(null, [this.conditionRequired3()]),
            "nric": new FormControl(null, [this.conditionRequired3()]),
            "gender": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "nationality": new FormControl("", [this.conditionRequired2("isMyInfo", false)]),
            "residentialStatus": new FormControl("", [this.conditionRequired2("isMyInfo", false)]),
            "dateOfBirth": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "postalCode": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "address": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "unitNumber": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "mobile": new FormControl(null, [this.conditionRequired3()]),
            "email": new FormControl(null, [this.conditionRequired3()]),
            "netAnnualIncome": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "employerName": new FormControl(null, [this.conditionRequired2("isMyInfo", false)]),
            "assessmentYear": new FormControl("", [this.conditionRequired2("isMyInfo", false)]),
        })

        this.vehicleForm.get("vehicleModelCode").valueChanges
        .subscribe((code)=>{
            this.vehicleForm.patchValue({
                vehicleModelName: 
                    this.vehicleBrands?.find(item => item.brandName === this.vehicleForm.get("brand").value)?.vehicleModels?.find(item => item.code === code)?.name
            })
        })

        this.customerForm.get("isMyInfo").valueChanges
        .subscribe(() => {
            const newData = { ... this.customerForm.value };
            delete newData["isMyInfo"]
            this.customerForm.patchValue(newData);
        })

        this.guarantorForm.get("isMyInfo").valueChanges
        .subscribe(() => {
            console.log("NONO")
            const newData = { ... this.guarantorForm.value };
            delete newData["isMyInfo"]
            this.guarantorForm.patchValue(newData);
        })

        this.apiService.VehicleBrand()
        .subscribe((resp: Array<VehicleBrand>) =>{
            console.log(resp);
            this.vehicleBrands = resp;
        })

        this.apiService.OrderDropdown()
        .subscribe((resp: Array<Dropdown>) =>{
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
                this.uploadAttachFile = [...this.updateOrder?.supportingDocs];
                this.additionalForm.patchValue({...data});
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
            let initCustomerType = "Corporate";
            let initVehicleCondition = "New";
            let initVehicleType = "PC";
            
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
                id ? this.apiService.OrderDelete(id) : new Observable<void>(sub => sub.next())
            )
        )
        .subscribe(() =>{
            this.location.back();
        })
    }

    onSave(){
        if(this.onCheckPageValid()){
            this.onCreateUpdate()
            .subscribe((resp: string[]) =>{
                this.showSavedPopTimer = setTimeout(() => {
                    this.router.navigate([""]);
                }, 4000);
            })
        }
    }

    onClearSaveTimer(){
        clearTimeout(this.showSavedPopTimer);
        this.router.navigate([""]);
    }

    onPreview(){
        if(this.onCheckPageValid()){
            this.onCreateUpdate()
            .subscribe((resp: string[]) =>{
                console.log(resp)
                this.router.navigate(["preview", this.updateOrder.id],{
                    state: { orderInfo: this.updateOrder }
                })
            })
        }
    }

    onBrandChange(){
        const brandName = this.vehicleForm.get('brand').value;
        const vehicleCode = this.vehicleBrands?.find(item => item.brandName === brandName)?.vehicleModels[0]?.code;
        this.vehicleForm.patchValue({ vehicleModelCode: vehicleCode })
    }

    onSwitchGuarantor(){
        this.guarantorOn = !this.guarantorOn;
        this.guarantorForm.patchValue({ isMyInfo: this.guarantorForm.get('isMyInfo').value })
    }

    onFileAttach(file: File, fileType: "LogCard" | "SalesAgreement"){
        const deleteArr: Array<FileRecord> = [];
        const newUploadArr: Array<FileRecord> = [];
        this.uploadAttachFile.forEach(item => {
            item.fileType === fileType ? deleteArr.push({id: item.id, fileType: item.fileType}) : newUploadArr.push(item);
        })
        newUploadArr.push({fileType: fileType, fileName: file.name, file: file});
        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);

        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onFileDelete(inputIndex: number){
        const deleteArr: Array<FileRecord> = [];
        const newUploadArr: Array<FileRecord> = [];

        this.uploadAttachFile.forEach((item, index) => {
            index !== inputIndex ? newUploadArr.push(item) : deleteArr.push({id: item.id, fileType: item.fileType})
        });

        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);

        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onDocChange(inputIndex: number, file: File){
        const obj = this.uploadAttachFile[inputIndex];
        const deleteArr: Array<FileRecord> = [];
        obj.id && obj.fileType && deleteArr.push({id: obj.id, fileType: obj.fileType})
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);
        this.uploadAttachFile[inputIndex] = {fileType: 'GeneralFile', fileName: file.name, file: file}
        
        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onDocsAppend(files: FileList, fileType: "GeneralFile"){
        const fileArr = Array.from(files).map(item => ({
            fileType: fileType,
            files: item,
            fileName: item.name
        }));
        const newUploadFiles: FileRecord[] = [...this.uploadAttachFile, ...fileArr]
        this.uploadAttachFile = newUploadFiles;

        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onChangePostal(value: string, formName: "customerForm" | "guarantorForm"){
        if(value.length === 6){
            this.apiService.OrderAddress(value)
            .subscribe((resp: AddressResp[]) =>{
                console.log(resp)
                const data = resp[0];
                const address = `${data?.buildingName || ""} ${data?.buildingNo || ""} ${data?.streetName || ""} ${data?.countryCode || ""}`;
                this[formName].patchValue({ address: address})
            })
        }
    }

    onTouchedNInvalid(form: FormGroup){
        const result = Object.keys(form.value).filter(item => form.get(item).touched && form.get(item).invalid);
        return result.length > 0;
    }

    private onCheckPageValid(){
        const needUploadGeneralFile = !(this.customerForm.get('isMyInfo').value && this.guarantorForm.get('isMyInfo').value && this.guarantorOn);
        this.vehicleForm.markAllAsTouched();
        this.additionalForm.markAllAsTouched();
        this.financeForm.markAllAsTouched();
        this.customerForm.markAllAsTouched();
        this.guarantorOn && this.guarantorForm.markAllAsTouched();

        let numLogCard = 0;
        let numSalesAgreement = 0;
        let numGeneralFile = 0

        this.uploadAttachFile.forEach((item) => {
            if(item.fileType === "LogCard")
                return numLogCard ++;
            if(item.fileType === "SalesAgreement")
                return numSalesAgreement ++;
            if(item.fileType === "GeneralFile")
                return numGeneralFile ++;
        });

        return (this.vehicleForm.valid && 
            this.additionalForm.valid && 
            this.financeForm.valid && 
            this.customerForm.valid && 
            this.guarantorForm.valid && 
            numLogCard > 0 && 
            numSalesAgreement > 0 && 
            (!needUploadGeneralFile || numGeneralFile > 0)
        )
    }

    private onCreateUpdate(){
        return of(this.updateOrder?.id)
        .pipe(
            mergeMap((id: number) => {
                const cIsMyInfo = this.customerForm.get('isMyInfo').value
                const gIsMyInfo = this.guarantorForm.get('isMyInfo').value
                const req: OrderDetail = {
                    ...this.vehicleForm.value,
                    ...this.additionalForm.value,
                    ...this.financeForm.value,
                    customer:{
                        ...this.customerForm.value,
                        gender: cIsMyInfo ? null: this.customerForm.get('gender').value,
                        nationality: cIsMyInfo ? null: this.customerForm.get('nationality').value,
                        residentialStatus: cIsMyInfo ? null: this.customerForm.get('residentialStatus').value,
                        dateOfBirth: cIsMyInfo ? null: this.customerForm.get('dateOfBirth').value,
                        postalCode: cIsMyInfo ? null: this.customerForm.get('postalCode').value,
                        address: cIsMyInfo ? null: this.customerForm.get('address').value,
                        unitNumber: cIsMyInfo ? null: this.customerForm.get('unitNumber').value,
                        netAnnualIncome: cIsMyInfo ? null: this.customerForm.get('netAnnualIncome').value,
                        employerName: cIsMyInfo ? null: this.customerForm.get('employerName').value,
                        assessmentYear: cIsMyInfo ? null: this.customerForm.get('assessmentYear').value,
                    },
                    guarantor: this.guarantorOn ? {
                        ...this.guarantorForm.value,
                        gender: gIsMyInfo ? null: this.guarantorForm.get('gender').value,
                        nationality: gIsMyInfo ? null: this.guarantorForm.get('nationality').value,
                        residentialStatus: gIsMyInfo ? null: this.guarantorForm.get('residentialStatus').value,
                        dateOfBirth: gIsMyInfo ? null: this.guarantorForm.get('dateOfBirth').value,
                        postalCode: gIsMyInfo ? null: this.guarantorForm.get('postalCode').value,
                        address: gIsMyInfo ? null: this.guarantorForm.get('address').value,
                        unitNumber: gIsMyInfo ? null: this.guarantorForm.get('unitNumber').value,
                        netAnnualIncome: gIsMyInfo ? null: this.guarantorForm.get('netAnnualIncome').value,
                        employerName: gIsMyInfo ? null: this.guarantorForm.get('employerName').value,
                        assessmentYear: gIsMyInfo ? null: this.guarantorForm.get('assessmentYear').value,
                    } : null
                }
                return id ? this.apiService.OrderUpdate(id, req) : this.apiService.OrderCreate(req)
            }),
            mergeMap((orderDetail: OrderDetail) =>{
                // if update orderDetail = {}
                orderDetail?.id && (this.updateOrder = orderDetail);
                const allRequests: Promise<string>[] = [].concat(
                    // delete
                    this.deleteAttachId
                    .filter(item => item.id !== null && item.id !== undefined)
                    .map(item => 
                        from(this.apiService.OrderAttachDelete(item.id))
                        .pipe(
                            map(() =>  `Success delete`),
                            catchError(err => `Error while deleting ${err.message}`)
                        ).toPromise()
                    )
                )
                .concat(
                    // upload
                    this.uploadAttachFile
                    .map(async (item) => {
                        const needUploadGeneralFile = !(this.customerForm.get('isMyInfo').value && this.guarantorForm.get('isMyInfo').value && this.guarantorOn);
                        if(!item.id && item.file && ((item.fileType === "GeneralFile" && needUploadGeneralFile) || item.fileType === "LogCard" || item.fileType === "SalesAgreement")){
                            const salesReq: AttachUploadReq = {
                                attachmentType: item.fileType,
                                orderId: (orderDetail.id || this.updateOrder.id)?.toString(),
                                fileName: item.fileName,
                                fileContent: await this.onFileToBase64(item.file)
                            }
                            return from(this.apiService.OrderAttachUpload(salesReq))
                                .pipe(
                                    map(() => {
                                        this.updateOrder.supportingDocs.push({id: -1, fileName: item.fileName, fileType: item.fileType})
                                        return `Success upload`
                                    }),
                                    catchError(err => `Error while uploading ${err.message}`)
                                ).toPromise()
                        }
                        return null;
                    })
                )
                return combineLatest(allRequests);
            })
        )
    }

    private onFileToBase64(file: File): Promise<string> {
        const result_base64 = new Promise<string>((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                const convertResult = fileReader.result as string;
                const result = convertResult.split("base64,").pop();
                resolve(result)
            }
            fileReader.readAsDataURL(file);
        });

        return result_base64;
    }
}
