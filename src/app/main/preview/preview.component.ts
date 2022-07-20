import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetail } from 'src/app/interfaces/api.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['../../../styles/preview.css'],
})
export class PreviewComponent extends BaseComponent implements OnInit {
    id: number;
    orderInfo: OrderDetail;
    generalDocsLimit = 6;
    showConfirmModal = false;

    constructor(
        @Inject(PLATFORM_ID) protected platformId: object,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(platformId);
        this.orderInfo =
            this.router.getCurrentNavigation()?.extras?.state?.orderInfo;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params?.id;
        if (!this.orderInfo) {
            this.apiService.OrderById(this.id).subscribe(
                (resp: OrderDetail) => {
                    this.orderInfo = resp;
                    super.unactiveLoader();
                },
                (err: HttpErrorResponse) => {
                    console.log(err);
                }
            );
        } else {
            super.unactiveLoader();
        }
    }

    onEdit(): void {
        this.router.navigate(['create-update', this.id], {
            state: { orderInfo: this.orderInfo },
        });
    }

    onDownload(): void {
        this.apiService.OrderPdf(this.id).subscribe(
            (resp: Blob) => {
                if (isPlatformBrowser(this.platformId)) {
                    super.downloadFile(resp, `OrderId_${this.id}`);
                }
            },
            (err: HttpErrorResponse) => {
                console.log(err);
            }
        );
    }

    onSubmit(): void {
        this.apiService.OrderSubmit(this.id).subscribe(
            () => {
                super.showPopInfo = {
                    timer: setTimeout(() => {
                        this.router.navigate(['']);
                    }, 4000),
                    popmsg: 'Successfully Submitted',
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
