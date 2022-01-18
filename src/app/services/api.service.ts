import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint, ApiModel, OrderFilterReq, UpdateProfileReq, UserLoginReq, UserLoginResp, UserPasswordForgetReq, UserPasswordForgetResp, UserPasswordUpdateReq, UserPasswordUpdateResp, UserProfileResp } from '../interfaces/api.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const basicUrl = environment.basicUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) { }

    private HttpHandle<T2>(method: Observable<ApiModel<T2>>, url: string): Observable<T2>{
        return method.pipe(
            map((apiResp: ApiModel<T2>)=>{
                console.log(apiResp);
                if(!apiResp){
                    return null;
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
            basicUrl + ApiEndpoint.UserLogin
        );
    }

    UserLogout(){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserLogout, null),
            basicUrl + ApiEndpoint.UserLogout
        );
    }

    UserPasswordForget(req: UserPasswordForgetReq){
        return this.HttpHandle<UserPasswordForgetResp>(
            this.http.post<ApiModel<UserPasswordForgetResp>>(basicUrl + ApiEndpoint.UserPasswordForget, req),
            basicUrl + ApiEndpoint.UserPasswordForget
        );
    }

    UserProfile(){
        return this.HttpHandle<UserProfileResp>(
            this.http.get<ApiModel<UserProfileResp>>(basicUrl + ApiEndpoint.UserProfile),
            basicUrl + ApiEndpoint.UserProfile
        );
    }

    UpdateProfile(req: UpdateProfileReq){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserProfile, req),
            ApiEndpoint.UserProfile
        )
    }

    UpdatePassword(req: UserPasswordUpdateReq){
        return this.HttpHandle<void>(
            this.http.post<ApiModel<void>>(basicUrl + ApiEndpoint.UserPasswordUpdate, req),
            ApiEndpoint.UserPasswordUpdate
        )
    }

    OrderFilter(res: OrderFilterReq){
        
    }
}
