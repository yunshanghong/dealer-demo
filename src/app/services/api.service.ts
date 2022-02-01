import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint, ApiModel, OrderReq, OrderFilterResp, UpdateProfileReq, UserLoginReq, UserLoginResp, UserPasswordForgetReq, UserPasswordForgetResp, UserPasswordUpdateReq, UserProfileResp, OrderDetail, VehicleBrand, Dropdown, AttachUploadReq } from '../interfaces/api.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const basicUrl = environment.basicUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) { }

    private HttpHandle<T2>(method: Observable<ApiModel<T2>>): Observable<T2>{
        return method.pipe(
            map((apiResp: ApiModel<T2>)=>{
                console.log(apiResp);
                const status = apiResp.status;
                
                if(!status.isSuccess || status.errorCode !== 0){
                    throw new HttpErrorResponse({
                        error: { details: status.errorDescription }
                    });
                }
                return apiResp.data;
            })
        )
    }

    UserLogin(req: UserLoginReq): Observable<UserLoginResp> {
        return this.HttpHandle<UserLoginResp>(
            this.http.post<ApiModel<UserLoginResp>>(basicUrl + ApiEndpoint.UserLogin, req),
        );
    }

    UserLogout(): Observable<void>{
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserLogout, null),
        );
    }

    UserPasswordForget(req: UserPasswordForgetReq): Observable<UserPasswordForgetResp>{
        return this.HttpHandle<UserPasswordForgetResp>(
            this.http.post<ApiModel<UserPasswordForgetResp>>(basicUrl + ApiEndpoint.UserPasswordForget, req),
        );
    }

    UserProfile(): Observable<UserProfileResp>{
        return this.HttpHandle<UserProfileResp>(
            this.http.get<ApiModel<UserProfileResp>>(basicUrl + ApiEndpoint.UserProfile),
        );
    }

    UpdateProfile(req: UpdateProfileReq): Observable<void>{
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserProfile, req),
        )
    }

    UpdatePassword(req: UserPasswordUpdateReq): Observable<void>{
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserPasswordUpdate, req),
        )
    }

    OrderCreate(req: OrderDetail): Observable<OrderDetail>{
        return this.HttpHandle<OrderDetail>(
            this.http.post<ApiModel<OrderDetail>>(basicUrl + ApiEndpoint.OrderCreate, req),
        )
    }

    OrderFilter(req: OrderReq): Observable<OrderFilterResp>{
        return this.HttpHandle<OrderFilterResp>(
            this.http.post<ApiModel<OrderFilterResp>>(basicUrl + ApiEndpoint.OrderFilter, req),
        )
    }

    OrderById(orderId: number): Observable<OrderDetail>{
        return this.HttpHandle<OrderDetail>(
            this.http.get<ApiModel<OrderDetail>>(basicUrl + ApiEndpoint.OrderById.replace(ApiEndpoint.OrderId, orderId.toString()))
        )
    }

    OrderSubmit(orderId: number): Observable<void>{
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.OrderSubmit.replace(ApiEndpoint.OrderId, orderId.toString()), null)
        )
    }

    OrderUpdate(orderId:number, req: OrderDetail): Observable<OrderDetail>{
        return this.HttpHandle<OrderDetail>(
            this.http.put<ApiModel<OrderDetail>>(basicUrl + ApiEndpoint.OrderById.replace(ApiEndpoint.OrderId, orderId.toString()), req)
        )
    }

    OrderDelete(orderId: number): Observable<void>{
        return this.HttpHandle<void>(
            this.http.delete<ApiModel<void>>(basicUrl + ApiEndpoint.OrderById.replace(ApiEndpoint.OrderId, orderId.toString()))
        )
    }

    OrderAttachUpload(req: AttachUploadReq): Observable<void>{
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.OrderAttachUpload, req)
        )
    }

    OrderAttachDelete(fileId: number){
        return this.HttpHandle<any>(
            this.http.delete<ApiModel<any>>(basicUrl + ApiEndpoint.OrderAttach.replace(ApiEndpoint.FileId, fileId.toString()))
        )
    }

    OrderPdf(orderId: number): Observable<Blob>{
        return this.http.get<Blob>
            (
                basicUrl + ApiEndpoint.OrderPdf.replace(ApiEndpoint.OrderId, orderId.toString()),
                { responseType: 'blob' as 'json'}
            )
    }

    OrderAddress(){

    }

    OrderDropdown(): Observable<Array<Dropdown>>{
        return this.HttpHandle<Array<Dropdown>>(
            this.http.get<ApiModel<Array<Dropdown>>>(basicUrl + ApiEndpoint.OrderDropdown)
        )
    }

    OrderExport(req: OrderReq): Observable<Blob>{
        return this.http.post<Blob>
            (
                basicUrl + ApiEndpoint.OrderExport, 
                req,
                { responseType: 'blob' as 'json' }
            )
    }

    VehicleBrand(): Observable<Array<VehicleBrand>>{
        return this.HttpHandle<Array<VehicleBrand>>(
            this.http.get<ApiModel<Array<VehicleBrand>>>(basicUrl + ApiEndpoint.VehicleBrand)
        )
    }
}
