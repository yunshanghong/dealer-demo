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
    OrderById = "Order/{orderId}",
    OrderPdf = "Order/{orderId}/pdf",
    OrderExport = "Order/Export",

    OrderId = "{orderId}",
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

export interface OrderByIdResp{
    id: number,
    orderNumber: string,
    customerType: string,
    vehicleCondition: string,
    vehicleType: string,
    brand: string,
    vehicleModelCode: string,
    vehicleModelName: string,
    vehicleVariantCode: string,
    vehicleVariantName: string,
    hasAdditionalStructure: boolean,
    priceWithGst: number,
    financedAmount: number,
    interest: number,
    tenure: number,
    monthlyInstallment: number,
    customer: Customer,
    guarantor: Customer,
    vehicleNumber: string,
    supportingDocs: Array<any>
}

export interface Customer{
    id: number,
    isMyInfo: boolean,
    name: string,
    nric: string,
    email: string,
    mobile: string,
    gender: string,
    nationality: string,
    residentialStatus: string,
    dateOfBirth: Date,
    postalCode: string,
    address: string,
    unitNumber: string,
    netAnnualIncome: number,
    employerName: string,
    assessmentYear: string,
    supportingDocs: string
}

export interface User{
    accessToken: string;
    userName: string;
    email: string;
    name: string;
    mobile: string;
    rememberMe?: boolean;
}
