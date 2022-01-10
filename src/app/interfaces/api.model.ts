export enum ApiEndpoint{
    // User region
	UserLogin = "User/Login",
    UserLogout = "User/Login",
    
    // User Password region
    UserPasswordForget = "User/Password/Forget",
    UserPasswordReset = "User/Password/Reset",
    UserPasswordUpdate = "User/Password/Update",

}


export interface UserLoginReq {
	username: string;
	password: string;
}


export interface UserLoginResp {
	accessToken: string;
    expiresIn: number;
    tokenType: string;
    refreshToken: string;
}

export interface UserPasswordForgetReq{
    email: string;
}


export interface User{
    accessToken: string;
    userName: string;
}
