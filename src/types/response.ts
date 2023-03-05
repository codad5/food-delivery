import { signupFieldError } from "./field"
import { User } from "./modelData"

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

export type VerifyPhonResponse = User

export type UserSignupErrorResponse = {
    name: string ,
    phone : string, 
    email ?: string,
    message ?: string,
    errorInput?: signupFieldError[]
}

export type UserVerificationErrorResponse = {
    phone:string,
    name?:string,
    email?:string,
    message?:string
}
export type ServerErrorResponse = {
    message:string,
    errorcode: number
}

export type SuccessResponseData = UserSignupResponse | VerifyPhonResponse;

export type ErrorResponseData = ServerErrorResponse | UserSignupErrorResponse | UserVerificationErrorResponse

export type ResponseData = SuccessResponseData|ErrorResponseData