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
    OrderAttachUpload = "Order/Attachment",
    OrderAttach = "Order/Attachment/{fileId}",
    OrderCreate = "Order",
    OrderById = "Order/{orderId}",
    OrderSubmit = "Order/Submit/{orderId}",
    OrderFilter = "Order/Filter",
    OrderPdf = "Order/{orderId}/pdf",
    OrderAddress = "Order/Address",
    OrderDropdown = "Order/Dropdown",
    OrderExport = "Order/Export",
    
    OrderId = "{orderId}",
    FileId = "{fileId}",
    // Vehicle
    VehicleBrand = "Vehicle/brand/%20",
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

export interface OrderReq extends SearchBarInfo{
    status: string[];
    pageIndex: number;
    pageSize: number;
    sortRequest: {
        key: string;
        isAscending: boolean;
    }
}

export interface SearchBarInfo{
    orderNumber: string;
    applicationDateFromUtc: Date;
    applicationDateToUtc: Date;
    applicantName: string;
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

export interface OrderDetail{
    id?: number,
    orderNumber?: string,
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
    supportingDocs: Array<SupportingDoc>
}

export interface SupportingDoc{
    id: number;
    fileName: string;
    fileType: "LogCard" | "SalesAgreement" | "GeneralFile";
}

export interface Customer{
    id?: number,
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
    supportingDocs?: string
}

export interface Dropdown{
    id: number;
    category: string;
    items: Array<DropdownItem>
}

export interface DropdownItem{
    id: number;
    name: string;
}

export interface VehicleBrand{
    id: number,
    brandName: string,
    vehicleModels: Array<Vehicle>,
}

export interface Vehicle{
    id: number,
    name: string,
    code: string,
}

export interface AttachUploadReq{
    attachmentType: "LogCard" | "SalesAgreement" | "GeneralFile";
    orderId: string;
    fileName: string;
    fileContent: string; //Base64 encoded string
}

export interface FileRecord {
    id?: number;
    fileName?: string;
    fileType?: "LogCard" | "SalesAgreement" | "GeneralFile";
    file?: File;
}

export interface AddressResp{
    postalCode: string;
    buildingNo: number;
    buildingName: string;
    streetName: string;
    countryCode: string;
}

export interface User{
    accessToken: string;
    userName: string;
    email: string;
    name: string;
    mobile: string;
    rememberMe?: boolean;
}
