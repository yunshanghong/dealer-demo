import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint, ApiModel, OrderReq, OrderFilterResp, UpdateProfileReq, UserLoginReq, UserLoginResp, UserPasswordForgetReq, UserPasswordForgetResp, UserPasswordUpdateReq, UserProfileResp } from '../interfaces/api.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const basicUrl = environment.basicUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) { }

    private HttpHandle<T2>(method: Observable<ApiModel<T2>>): Observable<any>{
        return method.pipe(
            map((apiResp: ApiModel<T2>)=>{
                console.log(apiResp);
                if(!apiResp){
                    return null;
                }
                if(apiResp instanceof Blob){
                    return apiResp;
                }
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

    UserLogout(){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserLogout, null),
        );
    }

    UserPasswordForget(req: UserPasswordForgetReq){
        return this.HttpHandle<UserPasswordForgetResp>(
            this.http.post<ApiModel<UserPasswordForgetResp>>(basicUrl + ApiEndpoint.UserPasswordForget, req),
        );
    }

    UserProfile(){
        return this.HttpHandle<UserProfileResp>(
            this.http.get<ApiModel<UserProfileResp>>(basicUrl + ApiEndpoint.UserProfile),
        );
    }

    UpdateProfile(req: UpdateProfileReq){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserProfile, req),
        )
    }

    UpdatePassword(req: UserPasswordUpdateReq){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserPasswordUpdate, req),
        )
    }

    OrderFilter(req: OrderReq){
        return this.HttpHandle<OrderFilterResp>(
            this.http.post<ApiModel<OrderFilterResp>>(basicUrl + ApiEndpoint.OrderFilter, req),
        )
    }

    OrderExport(req: OrderReq){
        return this.HttpHandle<any>(
            this.http.post<ApiModel<any>>(
                basicUrl + ApiEndpoint.OrderExport, 
                req,
                { responseType: 'blob' as 'json' }
            )
        )
    }
}
