import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
    AddressResp,
    AttachUploadReq,
    Dropdown,
    DropdownItem,
    FileRecord,
    OrderDetail,
    SupportingDoc,
    VehicleBrand,
} from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
    selector: 'app-create-update',
    templateUrl: './create-update.component.html',
    styleUrls: ['../../../styles/create-update.css'],
})
export class CreateUpdateComponent extends BaseComponent implements OnInit {
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
    guarantorOn = false;
    showConfirmModal = false;
    assessmentYearDrop: number[] = [
        moment().year(),
        moment().add(-1, 'y').year(),
        moment().add(-2, 'y').year(),
        moment().add(-3, 'y').year(),
    ];

    constructor(
        @Inject(PLATFORM_ID) protected platformId: object,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        super(platformId);
        this.updateOrder =
            this.router.getCurrentNavigation()?.extras?.state?.orderInfo;
    }

    private conditionRequired = (
        controlName: string,
        matchTo: boolean
    ): ((AbstractControl) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (
                control &&
                control.parent &&
                control.parent.get(controlName).value === matchTo
            ) {
                return control.value ? null : { isMatching: false };
            }
            return null;
        };
    };

    private conditionRequired2 = (
        controlName: string,
        matchTo: boolean
    ): ((AbstractControl) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (
                this.guarantorOn &&
                control &&
                control.parent &&
                control.parent.get(controlName).value === matchTo
            ) {
                return control.value ? null : { isMatching: false };
            }
            return null;
        };
    };

    private conditionRequired3 = (): ((
        AbstractControl
    ) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.guarantorOn) {
                return control.value !== null &&
                    control.value !== '' &&
                    control.value !== undefined
                    ? null
                    : { isMatching: false };
            }
            return null;
        };
    };

    private vehicleNumberRequired = (): ((
        AbstractControl
    ) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            return this.vehicleForm &&
                (this.vehicleForm.get('vehicleCondition').value !== 'Used' ||
                    (this.vehicleForm.get('vehicleCondition').value ===
                        'Used' &&
                        control &&
                        control.value))
                ? null
                : { isMatching: false };
        };
    };

    private additionalStructureRequired = (): ((
        AbstractControl
    ) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            return this.vehicleForm &&
                (this.vehicleForm.value.vehicleType !== 'CV' ||
                    (this.vehicleForm.value.vehicleType === 'CV' &&
                        control &&
                        (control.value !== undefined ||
                            control.value !== null)))
                ? null
                : { isMatching: false };
        };
    };

    private emailPatternCheck = (): ((
        AbstractControl
    ) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.guarantorOn) {
                const emailRule =
                    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

                return control?.value?.match(emailRule)
                    ? null
                    : { email: true };
            }
            return null;
        };
    };

    private onlyDollarSign = (): ((
        AbstractControl
    ) => ValidationErrors | null) => {
        return (control: AbstractControl): ValidationErrors | null => {
            return this.vehicleForm && control ? null : { isMatching: false };
        };
    };

    ngOnInit(): void {
        this.vehicleForm = new FormGroup({
            customerType: new FormControl(null, [Validators.required]),
            vehicleCondition: new FormControl(null, [Validators.required]),
            vehicleType: new FormControl(null, [Validators.required]),
            brand: new FormControl('', []),
            vehicleModelCode: new FormControl('', []),
            vehicleModelName: new FormControl('', []),
        });

        this.additionalForm = new FormGroup({
            vehicleNumber: new FormControl(null, [
                this.vehicleNumberRequired(),
            ]),
            hasAdditionalStructure: new FormControl(null, [
                this.additionalStructureRequired(),
            ]),
        });

        this.financeForm = new FormGroup({
            priceWithGst: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[\d,.$]*$/),
                this.onlyDollarSign(),
            ]),
            financedAmount: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[\d,.$]*$/),
                this.onlyDollarSign(),
            ]),
            tenure: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[\d,.]*$/),
            ]),
            interest: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[\d,.]*$/),
            ]),
            monthlyInstallment: new FormControl(null, [
                Validators.pattern(/^[\d,.$]*$/),
                this.onlyDollarSign(),
            ]),
        });

        const mobileRule = /^[0-9]{8}$/;

        this.customerForm = new FormGroup({
            isMyInfo: new FormControl(false, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            nric: new FormControl(null, [Validators.required]),
            gender: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            nationality: new FormControl('', [
                this.conditionRequired('isMyInfo', false),
            ]),
            residentialStatus: new FormControl('', [
                this.conditionRequired('isMyInfo', false),
            ]),
            dateOfBirth: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            postalCode: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            address: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            unitNumber: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            mobile: new FormControl(null, [
                Validators.required,
                Validators.pattern(mobileRule),
            ]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            netAnnualIncome: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
                Validators.pattern(/^[\d,.$]*$/),
                this.onlyDollarSign(),
            ]),
            employerName: new FormControl(null, [
                this.conditionRequired('isMyInfo', false),
            ]),
            assessmentYear: new FormControl(this.assessmentYearDrop[0], [
                this.conditionRequired('isMyInfo', false),
            ]),
        });

        this.guarantorForm = new FormGroup({
            isMyInfo: new FormControl(false, [this.conditionRequired3()]),
            name: new FormControl(null, [this.conditionRequired3()]),
            nric: new FormControl(null, [this.conditionRequired3()]),
            gender: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            nationality: new FormControl('', [
                this.conditionRequired2('isMyInfo', false),
            ]),
            residentialStatus: new FormControl('', [
                this.conditionRequired2('isMyInfo', false),
            ]),
            dateOfBirth: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            postalCode: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            address: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            unitNumber: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            mobile: new FormControl(null, [
                this.conditionRequired3(),
                Validators.pattern(mobileRule),
            ]),
            email: new FormControl(null, [
                this.conditionRequired3(),
                this.emailPatternCheck(),
            ]),
            netAnnualIncome: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
                Validators.pattern(/^[\d,.$]*$/),
                this.onlyDollarSign(),
            ]),
            employerName: new FormControl(null, [
                this.conditionRequired2('isMyInfo', false),
            ]),
            assessmentYear: new FormControl(this.assessmentYearDrop[0], [
                this.conditionRequired2('isMyInfo', false),
            ]),
        });

        this.vehicleForm
            .get('vehicleModelCode')
            .valueChanges.subscribe((code) => {
                this.vehicleForm.patchValue({
                    vehicleModelName: this.vehicleBrands
                        ?.find(
                            (item) =>
                                item.brandName ===
                                this.vehicleForm.get('brand').value
                        )
                        ?.vehicleModels?.find((item) => item.code === code)
                        ?.name,
                });
            });

        this.customerForm.get('isMyInfo').valueChanges.subscribe(() => {
            const newData = { ...this.customerForm.value };
            delete newData['isMyInfo'];
            this.customerForm.patchValue(newData);
        });

        this.guarantorForm.get('isMyInfo').valueChanges.subscribe(() => {
            const newData = { ...this.guarantorForm.value };
            delete newData['isMyInfo'];
            this.guarantorForm.patchValue(newData);
        });

        this.vehicleForm
            .get('vehicleCondition')
            .valueChanges.subscribe((value) => {
                if (value === 'New') {
                    this.additionalForm.patchValue({
                        vehicleNumber: null,
                    });

                    const deleteArr: Array<FileRecord> = [];
                    const newUploadArr: Array<FileRecord> = [];

                    this.uploadAttachFile.forEach((item) => {
                        item.fileType === 'LogCard'
                            ? deleteArr.push({
                                  id: item.id,
                                  fileType: item.fileType,
                              })
                            : newUploadArr.push(item);
                    });

                    this.uploadAttachFile = newUploadArr;
                    this.deleteAttachId = this.deleteAttachId.concat(deleteArr);
                }
            });

        this.vehicleForm.get('vehicleType').valueChanges.subscribe((value) => {
            if (value === 'PC') {
                this.additionalForm.patchValue({
                    hasAdditionalStructure: null,
                });
            }
        });

        this.financeForm.valueChanges.subscribe((form) => {
            this.financeForm.patchValue(
                {
                    priceWithGst: this.onConvertToMoney(form?.priceWithGst),
                    financedAmount: this.onConvertToMoney(form?.financedAmount),
                    tenure: this.onConvertWithComma(form?.tenure),
                    interest: this.onConvertWithComma(form?.interest),
                    monthlyInstallment: this.onConvertToMoney(
                        form?.monthlyInstallment
                    ),
                },
                { emitEvent: false }
            );
        });

        this.customerForm
            .get('netAnnualIncome')
            .valueChanges.subscribe((value) => {
                this.customerForm.patchValue(
                    {
                        netAnnualIncome: this.onConvertToMoney(value),
                    },
                    { emitEvent: false }
                );
            });

        this.guarantorForm
            .get('netAnnualIncome')
            .valueChanges.subscribe((value) => {
                this.guarantorForm.patchValue(
                    {
                        netAnnualIncome: this.onConvertToMoney(value),
                    },
                    { emitEvent: false }
                );
            });

        this.apiService
            .VehicleBrand()
            .subscribe((resp: Array<VehicleBrand>) => {
                this.vehicleBrands = resp;
            });

        this.apiService.OrderDropdown().subscribe((resp: Array<Dropdown>) => {
            this.nations = resp.find(
                (item) => item.category === 'Order.Nationalities'
            )?.items;
            this.residentStatus = resp.find(
                (item) => item.category === 'Order.ResidentialStatus'
            )?.items;
        });

        const updateId = this.route.snapshot.params?.id;
        // update flow
        if (updateId !== undefined) {
            of(this.updateOrder)
                .pipe(
                    mergeMap((order: OrderDetail) =>
                        order
                            ? new Observable<OrderDetail>((sub) =>
                                  sub.next(order)
                              )
                            : this.apiService.OrderById(updateId)
                    )
                )
                .subscribe((data: OrderDetail) => {
                    super.unactiveLoader();
                    this.updateOrder = data;
                    this.uploadAttachFile = [
                        ...this.updateOrder?.supportingDocs,
                    ];
                    this.additionalForm.patchValue({ ...data });
                    this.vehicleForm.patchValue({ ...data });
                    this.financeForm.patchValue({ ...data });
                    this.customerForm.patchValue({ ...data.customer });
                    if (data.guarantor) {
                        this.guarantorOn = true;
                        this.guarantorForm.patchValue({ ...data.guarantor });
                    }
                });
        }
        // create flow
        else {
            const paramType = this.route.snapshot.queryParams.type;
            let initCustomerType = 'Corporate';
            let initVehicleCondition = 'New';
            let initVehicleType = 'PC';

            if (paramType === 'New PC') {
                initCustomerType = 'Individual';
                initVehicleCondition = 'New';
                initVehicleType = 'PC';
            } else if (paramType === 'New CV') {
                initCustomerType = 'Corporate';
                initVehicleCondition = 'New';
                initVehicleType = 'CV';
            } else if (paramType === 'Used PC') {
                initCustomerType = 'Individual';
                initVehicleCondition = 'Used';
                initVehicleType = 'PC';
            } else if (paramType === 'Used CV') {
                initCustomerType = 'Corporate';
                initVehicleCondition = 'Used';
                initVehicleType = 'CV';
            }

            this.vehicleForm.patchValue({
                customerType: initCustomerType,
                vehicleCondition: initVehicleCondition,
                vehicleType: initVehicleType,
            });
            super.unactiveLoader();
        }
    }

    onDiscard(): void {
        of(this.updateOrder?.id)
            .pipe(
                mergeMap((id: number) =>
                    id
                        ? this.apiService.OrderDelete(id)
                        : new Observable<void>((sub) => sub.next())
                )
            )
            .subscribe(() => {
                this.location.back();
            });
    }

    onSave(): void {
        if (this.onCheckPageValid()) {
            this.onCreateUpdate().subscribe(
                (resp: string[]) => {
                    super.showPopInfo = {
                        timer: setTimeout(() => {
                            this.router.navigate(['']);
                        }, 4000),
                        popmsg: 'Saved',
                        successFunc: () => {
                            this.router.navigate(['']);
                        },
                    };
                },
                (error: HttpErrorResponse) => {
                    super.errorPopup(error);
                }
            );
        }
    }

    onPreview(): void {
        if (this.onCheckPageValid()) {
            this.onCreateUpdate().subscribe(
                (resp: string[]) => {
                    this.updateOrder = {
                        ...this.updateOrder,
                        ...this.vehicleForm.value,
                        ...this.additionalForm.value,
                        priceWithGst: this.eliminateSymbol(
                            this.financeForm.value.priceWithGst
                        ),
                        financedAmount: this.eliminateSymbol(
                            this.financeForm.value.financedAmount
                        ),
                        tenure: this.eliminateSymbol(
                            this.financeForm.value.tenure
                        ),
                        interest: this.eliminateSymbol(
                            this.financeForm.value.interest
                        ),
                        monthlyInstallment: this.eliminateSymbol(
                            this.financeForm.value.monthlyInstallment
                        ),
                        customer: {
                            ...this.customerForm.value,
                            netAnnualIncome: this.eliminateSymbol(
                                this.customerForm.value.netAnnualIncome
                            ),
                        },
                        guarantor: this.guarantorOn
                            ? {
                                  ...this.guarantorForm.value,
                                  netAnnualIncome: this.eliminateSymbol(
                                      this.customerForm.value.netAnnualIncome
                                  ),
                              }
                            : null,
                    };

                    this.router.navigate(['preview', this.updateOrder.id]);
                },
                (error: HttpErrorResponse) => {
                    super.errorPopup(error);
                }
            );
        }
    }

    onBrandChange(): void {
        const brandName = this.vehicleForm.get('brand').value;
        const vehicleCode = this.vehicleBrands?.find(
            (item) => item.brandName === brandName
        )?.vehicleModels[0]?.code;
        this.vehicleForm.patchValue({ vehicleModelCode: vehicleCode });
    }

    onSwitchGuarantor(): void {
        this.guarantorOn = !this.guarantorOn;
        this.guarantorForm.patchValue({
            isMyInfo: this.guarantorForm.get('isMyInfo').value,
        });
    }

    onFileAttach(file: File, fileType: 'LogCard' | 'SalesAgreement'): void {
        const deleteArr: Array<FileRecord> = [];
        const newUploadArr: Array<FileRecord> = [];
        this.uploadAttachFile.forEach((item) => {
            item.fileType === fileType
                ? deleteArr.push({ id: item.id, fileType: item.fileType })
                : newUploadArr.push(item);
        });
        newUploadArr.push({
            fileType,
            fileName: file.name,
            file,
        });
        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);
    }

    onFileDelete(inputIndex: number): void {
        const deleteArr: Array<FileRecord> = [];
        const newUploadArr: Array<FileRecord> = [];

        this.uploadAttachFile.forEach((item, index) => {
            index !== inputIndex
                ? newUploadArr.push(item)
                : deleteArr.push({ id: item.id, fileType: item.fileType });
        });

        this.uploadAttachFile = newUploadArr;
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);
    }

    onDocChange(inputIndex: number, file: File): void {
        const obj = this.uploadAttachFile[inputIndex];
        const deleteArr: Array<FileRecord> = [];
        if (obj.id && obj.fileType) {
            deleteArr.push({ id: obj.id, fileType: obj.fileType });
        }
        this.deleteAttachId = this.deleteAttachId.concat(deleteArr);
        this.uploadAttachFile[inputIndex] = {
            fileType: 'GeneralFile',
            fileName: file.name,
            file,
        };
    }

    onDocsAppend(files: FileList, fileType: 'GeneralFile'): void {
        const fileArr = Array.from(files).map((item) => ({
            fileType,
            file: item,
            fileName: item.name,
        }));
        const newUploadFiles: FileRecord[] = [
            ...this.uploadAttachFile,
            ...fileArr,
        ];
        this.uploadAttachFile = newUploadFiles;
    }

    onChangePostal(
        value: string,
        formName: 'customerForm' | 'guarantorForm'
    ): void {
        if (value.length === 6) {
            this.apiService
                .OrderAddress(value)
                .subscribe((resp: AddressResp[]) => {
                    const data = resp[0];
                    const address = `${data?.buildingName || ''} ${
                        data?.buildingNo || ''
                    } ${data?.streetName || ''} ${data?.countryCode || ''}`;
                    this[formName].patchValue({ address });
                });
        }
    }

    onTouchedNInvalid(form: FormGroup): boolean {
        const result = Object.keys(form.value).filter(
            (item) =>
                (form.get(item).touched || form.get(item).dirty) &&
                form.get(item).invalid
        );
        return result.length > 0;
    }

    onCustomerTouchedNInvalid(form: FormGroup): string {
        const formMapping = Object.keys(form.value)
            .filter(
                (item) =>
                    (form.get(item).touched || form.get(item).dirty) &&
                    form.get(item).invalid
            )
            .map((item) => form.get(item).errors);

        if (formMapping.length === 0) {
            return null;
        }

        if (formMapping[0]?.email) {
            return 'Please enter a valid email address';
        }

        if (formMapping[0]?.pattern?.requiredPattern === '/^[0-9]{8}$/') {
            return 'Please enter valid 8 digit number';
        }

        return 'Fields marked * are required please.';
    }

    private onCheckPageValid(): boolean {
        const needLogCardFile =
            this.vehicleForm.value.vehicleCondition === 'Used';
        const needUploadGeneralFile =
            !(
                this.customerForm.get('isMyInfo').value &&
                this.guarantorForm.get('isMyInfo').value &&
                this.guarantorOn
            ) && !this.customerForm.get('isMyInfo').value;
        this.vehicleForm.markAllAsTouched();
        this.additionalForm.markAllAsTouched();
        this.financeForm.markAllAsTouched();
        this.customerForm.markAllAsTouched();
        if (this.guarantorOn) {
            this.guarantorForm.markAllAsTouched();
        }

        let numLogCard = 0;
        let numSalesAgreement = 0;
        let numGeneralFile = 0;

        this.uploadAttachFile.forEach((item) => {
            if (item.fileType === 'LogCard') {
                return numLogCard++;
            }
            if (item.fileType === 'SalesAgreement') {
                return numSalesAgreement++;
            }
            if (item.fileType === 'GeneralFile') {
                return numGeneralFile++;
            }
        });

        return (
            this.vehicleForm.valid &&
            this.additionalForm.valid &&
            this.financeForm.valid &&
            this.customerForm.valid &&
            this.guarantorForm.valid &&
            (!needLogCardFile || numLogCard > 0) &&
            numSalesAgreement > 0 &&
            (!needUploadGeneralFile || numGeneralFile > 0)
        );
    }

    private onCreateUpdate(): Observable<string[]> {
        return of(this.updateOrder?.id).pipe(
            mergeMap((id: number) => {
                const cIsMyInfo = this.customerForm.get('isMyInfo').value;
                const gIsMyInfo = this.guarantorForm.get('isMyInfo').value;
                const req: OrderDetail = {
                    ...this.vehicleForm.value,
                    ...this.additionalForm.value,
                    priceWithGst: parseFloat(
                        this.financeForm.value.priceWithGst
                            .split('$')
                            .join('')
                            .split(',')
                            .join('')
                    ),
                    financedAmount: parseFloat(
                        this.financeForm.value.financedAmount
                            .split('$')
                            .join('')
                            .split(',')
                            .join('')
                    ),
                    tenure: parseFloat(
                        this.financeForm.value.tenure
                            .split('$')
                            .join('')
                            .split(',')
                            .join('')
                    ),
                    interest: parseFloat(
                        this.financeForm.value.interest
                            .split('$')
                            .join('')
                            .split(',')
                            .join('')
                    ),
                    monthlyInstallment: parseFloat(
                        this.financeForm.value.monthlyInstallment
                            ?.split('$')
                            .join('')
                            .split(',')
                            .join('')
                    ),
                    customer: {
                        ...this.customerForm.value,
                        gender: cIsMyInfo
                            ? null
                            : this.customerForm.get('gender').value,
                        nationality: cIsMyInfo
                            ? null
                            : this.customerForm.get('nationality').value,
                        residentialStatus: cIsMyInfo
                            ? null
                            : this.customerForm.get('residentialStatus').value,
                        dateOfBirth: cIsMyInfo
                            ? null
                            : this.customerForm.get('dateOfBirth').value,
                        postalCode: cIsMyInfo
                            ? null
                            : this.customerForm.get('postalCode').value,
                        address: cIsMyInfo
                            ? null
                            : this.customerForm.get('address').value,
                        unitNumber: cIsMyInfo
                            ? null
                            : this.customerForm.get('unitNumber').value,
                        netAnnualIncome: cIsMyInfo
                            ? null
                            : parseFloat(
                                  this.customerForm
                                      .get('netAnnualIncome')
                                      .value.split('$')
                                      .join('')
                                      .split(',')
                                      .join('')
                              ),
                        employerName: cIsMyInfo
                            ? null
                            : this.customerForm.get('employerName').value,
                        assessmentYear: cIsMyInfo
                            ? null
                            : this.customerForm
                                  .get('assessmentYear')
                                  .value.toString(),
                    },
                    guarantor: this.guarantorOn
                        ? {
                              ...this.guarantorForm.value,
                              gender: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('gender').value,
                              nationality: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('nationality').value,
                              residentialStatus: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('residentialStatus')
                                        .value,
                              dateOfBirth: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('dateOfBirth').value,
                              postalCode: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('postalCode').value,
                              address: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('address').value,
                              unitNumber: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('unitNumber').value,
                              netAnnualIncome: gIsMyInfo
                                  ? null
                                  : parseFloat(
                                        this.guarantorForm
                                            .get('netAnnualIncome')
                                            .value.split('$')
                                            .join('')
                                            .split(',')
                                            .join('')
                                    ),
                              employerName: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('employerName')
                                        .value,
                              assessmentYear: gIsMyInfo
                                  ? null
                                  : this.guarantorForm.get('assessmentYear')
                                        .value,
                          }
                        : null,
                };
                return id
                    ? this.apiService.OrderUpdate(id, req)
                    : this.apiService.OrderCreate(req);
            }),
            mergeMap((orderDetail: OrderDetail) => {
                // if update orderDetail = {}
                if (orderDetail?.id) {
                    this.updateOrder = orderDetail;
                }
                const allRequests: Promise<string>[] = []
                    .concat(
                        // delete
                        this.deleteAttachId
                            .filter(
                                (item) =>
                                    item.id !== null && item.id !== undefined
                            )
                            .map((item) =>
                                from(this.apiService.OrderAttachDelete(item.id))
                                    .pipe(
                                        map(() => {
                                            this.updateOrder.supportingDocs =
                                                this.updateOrder.supportingDocs.filter(
                                                    (doc) => doc.id !== item.id
                                                );
                                            return `Success delete`;
                                        }),
                                        catchError(
                                            (err) =>
                                                `Error while deleting ${err.message}`
                                        )
                                    )
                                    .toPromise()
                            )
                    )
                    .concat(
                        // upload
                        this.uploadAttachFile.map(async (item) => {
                            const needLogCardFile =
                                this.vehicleForm.value.vehicleCondition ===
                                'Used';
                            const needUploadGeneralFile =
                                !(
                                    this.customerForm.get('isMyInfo').value &&
                                    this.guarantorForm.get('isMyInfo').value &&
                                    this.guarantorOn
                                ) && !this.customerForm.get('isMyInfo').value;
                            if (
                                !item.id &&
                                item.file &&
                                ((item.fileType === 'GeneralFile' &&
                                    needUploadGeneralFile) ||
                                    (item.fileType === 'LogCard' &&
                                        needLogCardFile) ||
                                    item.fileType === 'SalesAgreement')
                            ) {
                                const salesReq: AttachUploadReq = {
                                    attachmentType: item.fileType,
                                    orderId: (
                                        orderDetail.id || this.updateOrder.id
                                    )?.toString(),
                                    fileName: item.fileName,
                                    fileContent: await this.onFileToBase64(
                                        item.file
                                    ),
                                };
                                return from(
                                    this.apiService.OrderAttachUpload(salesReq)
                                )
                                    .pipe(
                                        map((resp: SupportingDoc) => {
                                            this.updateOrder.supportingDocs.push(
                                                {
                                                    id: resp.id,
                                                    fileName: resp.fileName,
                                                    fileType: resp.fileType,
                                                }
                                            );
                                            return `Success upload`;
                                        }),
                                        catchError(
                                            (err) =>
                                                `Error while uploading ${err.message}`
                                        )
                                    )
                                    .toPromise();
                            }
                            return null;
                        })
                    );
                return combineLatest(allRequests);
            })
        );
    }

    private onFileToBase64(file: File): Promise<string> {
        const resultBase64 = new Promise<string>((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const convertResult = fileReader.result as string;
                const result = convertResult.split('base64,').pop();
                resolve(result);
            };
            fileReader.readAsDataURL(file);
        });

        return resultBase64;
    }

    private onConvertToMoney(inputStr: string): string {
        if (
            inputStr === null ||
            inputStr === undefined ||
            !inputStr.toString().match(/^[\d,.$]*$/)
        ) {
            return inputStr;
        }

        const wipeDollarSymbol = inputStr.toString().split('$').join('');
        if (!wipeDollarSymbol) {
            return '$';
        }

        const value = parseFloat(wipeDollarSymbol.split(',').join(''));

        if (value > Number.MAX_SAFE_INTEGER) {
            return `$${Number.MAX_SAFE_INTEGER.toLocaleString()}`;
        }
        const result = value.toLocaleString();

        return `$${result}${inputStr[inputStr.length - 1] === '.' ? '.' : ''}`;
    }

    private onConvertWithComma(inputStr: string): string {
        if (
            inputStr === null ||
            inputStr === undefined ||
            !inputStr.toString().match(/^[\d,.]*$/)
        ) {
            return inputStr;
        }

        const splitValue = inputStr.toString().split(',').join('');
        if (!splitValue) {
            return '';
        }

        const value = parseFloat(splitValue);
        if (value > Number.MAX_SAFE_INTEGER) {
            return Number.MAX_SAFE_INTEGER.toLocaleString();
        }
        const result = value.toLocaleString();

        return `${result}${inputStr[inputStr.length - 1] === '.' ? '.' : ''}`;
    }

    private eliminateSymbol(inputStr: string): number {
        return parseFloat(inputStr?.split(',').join('').split('$').join(''));
    }
}
