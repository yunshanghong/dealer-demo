export enum ApiEndpoint{
    // User region
	UserLogin = "User/Login",
    UserLogout = "User/Logout",
    
    // User Password region
    UserPasswordForget = "User/Password/Forget",
    UserPasswordReset = "User/Password/Reset",
    UserPasswordUpdate = "User/Password/Update",

    // User Profile
    UserProfile = "User/Profile",

    // Order
    OrderFilter = "Order/Filter",
    OrderPdf = "Order/{orderId}/pdf",
    OrderExport = "Order/Export",
}

export interface ApiModel<T>{
    status: {
        isSuccess: boolean;
        errorCode: number;
        errorDescription: string;
    },
    data: T
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
    username: string;
    email: string;
}

export interface UserPasswordForgetResp{
    message: string;
}

export interface UserProfileResp{
    username: string;
    name: string;
    email: string;
    mobile: string;
}

export interface UpdateProfileReq{
    name: string;
    email: string;
    mobile: string;
}

export interface UserPasswordUpdateReq{
    oldPassword: string;
    newPassword: string;
}


export interface OrderReq{
    orderNumber: string;
    applicationDateFromUtc: Date;
    applicationDateToUtc: Date;
    applicantName: string;
    status: string[];
    pageIndex: number;
    pageSize: number;
}

export interface OrderFilterResp{
    items: Array<OrderItem>,
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface OrderItem{
    id: number;
    orderNumber: string;
    applicationDate: Date;
    status: string;
    vehicleType: string;
    vehicleNumber: string;
    applicantName: string;
}

export interface User{
    accessToken: string;
    userName: string;
    email: string;
    name: string;
    mobile: string;
    rememberMe?: boolean;
}
