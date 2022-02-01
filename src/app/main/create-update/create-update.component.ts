import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AttachUploadReq, Dropdown, DropdownItem, FileRecord, OrderDetail, SupportingDoc, VehicleBrand } from 'src/app/interfaces/api.model';
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
    uploadAttachFile: Array<FileRecord> = [];
    deleteAttachId: Array<number> = [];
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
            "netAnnualIncome": new FormControl(0, [Validators.required]),
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
            "netAnnualIncome": new FormControl(0, [Validators.required]),
            "employerName": new FormControl(null, [Validators.required]),
            "assessmentYear": new FormControl(null, [Validators.required]),
            "nric": new FormControl(null, [Validators.required]),
        })

        this.vehicleForm.get("vehicleModelCode").valueChanges
        .subscribe((code)=>{
            this.vehicleForm.patchValue({
                vehicleModelName: 
                    this.vehicleBrands?.find(item => item.brandName === this.vehicleForm.get("brand").value)?.vehicleModels?.find(item => item.code === code)?.name
            })
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
                id ? this.apiService.OrderDelete(id) : new Observable<void>(sub => sub.next())
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
            }),
            // delete 
            mergeMap(async(orderDetail: OrderDetail) =>{
                console.log("OKOK")
                console.log(this.deleteAttachId);
                this.deleteAttachId.length > 0 &&
                this.deleteAttachId.forEach(async fileId =>{
                    this.apiService.OrderAttachDelete(fileId)
                    .subscribe((res)=>{
                        console.log(res)
                        console.log("delete")
                    })
                })
                return orderDetail;
            }),
            // upload
            mergeMap(async(orderDetail: OrderDetail) =>{
                console.log("NONO")
                console.log(this.uploadAttachFile);

                if(this.uploadAttachFile.length > 0 ){
                    this.uploadAttachFile.forEach(async item => {
                        if(!item.id && item.file){
                            const salesReq: AttachUploadReq = {
                                attachmentType: item.fileType,
                                orderId: orderDetail.id.toString(),
                                fileName: item.fileName,
                                fileContent: await this.onFileToBase64(item.file)
                            }
                            this.apiService.OrderAttachUpload(salesReq)
                            .subscribe((res) =>{
                                console.log(res)
                                console.log("upload")
                            })
                        }
                    })
                }
                return orderDetail;
            }),
        )
        .subscribe((res) =>{
            console.log(res);
            // this.router.navigate(['/']);
        })
    }

    onPreview(){
        console.log(this.vehicleForm.value)
        console.log(this.customerForm.value)
        console.log(this.guarantorForm?.value)
    }

    onBrandChange(){
        const brandName = this.vehicleForm.get('brand').value;
        const vehicleCode = this.vehicleBrands?.find(item => item.brandName === brandName)?.vehicleModels[0]?.code;
        this.vehicleForm.patchValue({ vehicleModelCode: vehicleCode })
    }

    onSwitchGuarantor(){
        this.guarantorOn = !this.guarantorOn;
        if(this.guarantorOn){
            this.guarantorForm.patchValue({ isMyInfo: false })
        }else{
            this.guarantorForm.reset();
        }
    }

    onFileAttach(file: File, fileType: "LogCard" | "SalesAgreement"){
        const includeArr: Array<number> = [];
        const newUploadArr: Array<FileRecord> = [];
        this.uploadAttachFile.forEach(item => {
            item.fileType === fileType ? includeArr.push(item.id) : newUploadArr.push(item);
        })
        newUploadArr.push({fileType: fileType, fileName: file.name, file: file});
        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(includeArr);

        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onFileDelete(inputIndex: number){
        const deleteArr: Array<number> = [];
        const newUploadArr: Array<FileRecord> = [];

        this.uploadAttachFile.forEach((item, index) => {
            index !== inputIndex ? newUploadArr.push(item) : (item.id && deleteArr.push(item.id))
        });

        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);

        console.log(this.uploadAttachFile);
        console.log(this.deleteAttachId);
    }

    onDocChange(inputIndex: number, file: File){
        const obj = this.uploadAttachFile[inputIndex];
        const deleteArr: Array<number> = [];
        obj.id && deleteArr.push(obj.id)
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
