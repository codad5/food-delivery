import ReponseHandler from "@utils/responseHandler"
import { UserSignupErrorResponse, UserVerificationErrorResponse } from "src/types/response"
import { signupFieldError } from "src/types/field"
import Validator from "@utils/Validator"
import { UserModel } from "@models/user";
import { generateVerificationCode, sendVerificationCode, setVerificationCode, VerifyPhone } from "@utils/verification";
import redisClient from "@services/redis";
import { hashPassword } from "@utils/helper";

export default class UserSignupController {
   
    name : string = ""
    phone : string = ""
    password : string = ""
    email ?: string
    userModel: UserModel;
    
    constructor (name : string , phone : string, password : string, email ?: string){
        this.name = name
        this.email = email
        this.phone = phone
        this.password = password
        this.userModel = new UserModel();
    }   

    public ValidateFields() {
        let errorJson:  UserSignupErrorResponse = {
            name: this.name as string,
            phone: this.phone as string,
            email: this.email as string,
            message:"form validation Error"
        }
        if (!this.name || !this.phone || !this.password) return errorJson = { ...errorJson, message:"Empty field", errorInput: ([{ data: this.name, name: "name" }, { data: this.phone, name: "phone" }, { data: this.password, name: "password" }] as { data: string, name: signupFieldError }[]).filter(v  => v.data == null).map(v => v.name)}
        
        if (!Validator.isStrongPassword(this.password)) return errorJson = {
                ...errorJson,
                message: "Poor password",
                errorInput: ["password"]
        }

        if (!Validator.isValidPhoneNumber(this.phone)) return errorJson = {
            ...errorJson,
            message: "Invalid Phone Number",
            errorInput: ["phone"]
        }

        if (this.email && !Validator.isValidEmail(this.email)) return errorJson = {
            ...errorJson,
            message: "Invalid email",
            errorInput: ["email"]
        }
        
        
        return null;
    }

    async userExist(): Promise<UserSignupErrorResponse | null>
    {
        let errorJson: UserSignupErrorResponse = {
            name: this.name as string,
            phone: this.phone as string,
            email: this.email as string,
            message: "User Exist"
        }
        if (await this.userModel.getUserByPhone(this.phone)) return errorJson = {
            ...errorJson,
            message: "Phone Number exist",
            errorInput: ["phone"]
        }
        if (this.email && await this.userModel.getUserByEmail(this.email)) return errorJson = {
            ...errorJson,
            message: "Email in use exist",
            errorInput: ["email"]
        }
        return null;
    }

    async create()
    {
        let userExist = await this.userExist()
        try{

            console.log(userExist)
            if (userExist) throw new Error(userExist.message)
            
            await this.userModel.createUser({
                name:this.name,
                phone:this.phone,
                password:hashPassword(this.password),
                email:this.email,
                verify:false
            })
        }
        catch(e)
        {
            if (e instanceof Error && e.message == userExist?.message) return { error: true, data: userExist };
            throw e;
        }
            
        return {error:false, data: await this.userModel.getUserByPhone(this.phone)};
    }

    async postSignup()
    {
        const code = await setVerificationCode(this.phone)
        await sendVerificationCode(this.phone, code) 
        return true
    }

    static async verify(phone: any, code: any) {
        const userModel =  new UserModel();
        let errorJson: UserVerificationErrorResponse = {
            phone: phone as string,
            message: "Error validating code"
        }
        const user = await userModel.getUserByPhone(phone)
        if (!user) return errorJson = {
            ...errorJson,
            message: "User Does Not exist"
        }

        const r_code  = await VerifyPhone(phone, code)
        if (!r_code) return errorJson = {
            ...errorJson,
            message: "Code expired"
        }
        return  await userModel.findOneAndUpdate("phone", phone, {verify:true});

    }
}