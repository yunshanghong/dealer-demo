import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint, UserLoginReq, UserLoginResp } from '../interfaces/api.model';
import { environment } from 'src/environments/environment';

const basicUrl = environment.basicUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) { }

    UserLogin(req: UserLoginReq): Observable<UserLoginResp> {
        return this.http.post<UserLoginResp>(basicUrl + ApiEndpoint.UserLogin, req)
    }

    UserLogout(){
        return this.http.post(basicUrl + ApiEndpoint.UserLogout, null);
    }
}
