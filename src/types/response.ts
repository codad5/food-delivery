import { signupFieldError } from "./field"

export type NewResponse<T> = {
    status: "success"|"error",
    code:number,
    message:string,
    data: T
}

export type UserSignupResponse = {
    name:string,
    phone:string,
    email?: string,
    token:string
}

export type UserSignupErrorResponse = {
    name: string ,
    phone : string, 
    email ?: string,
    message ?: string,
    errorInput?: signupFieldError[]
}

export type ServerErrorResponse = {
    message:string,
    errorcode: number
}

export type SuccessResponseData = UserSignupResponse;

export type ErrorResponseData = ServerErrorResponse | UserSignupErrorResponse

export type ResponseData = SuccessResponseData|ErrorResponseData