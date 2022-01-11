export enum ApiEndpoint{
    // User region
	UserLogin = "User/Login",
    UserLogout = "User/Logout",
    
    // User Password region
    UserPasswordForget = "User/Password/Forget",
    UserPasswordReset = "User/Password/Reset",
    UserPasswordUpdate = "User/Password/Update",

    // User Profile
    UserProfile = "User/Profile"
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

export interface UserPasswordForgetResp{
    success: boolean;
    message: string;
}

export interface UserProfileResp{
    username: string;
    name: string;
    email: string;
    mobile: string
}

export interface User{
    accessToken: string;
    userName: string;
    email: string;
    name: string;
    mobile: string;
    rememberMe?: boolean;
}