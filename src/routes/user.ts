import ReponseHandler from "@utils/responseHandler";
import { UserSignupErrorResponse } from "src/types/response"
import { Router } from "express";
import UserSignupController from "@controllers/usersignup";
import { User } from '../types/modelData'
import CustomException from "@utils/CustomException";
import { verify } from "crypto";

const router = Router();

router.post('/login', (req, res) => {
    console.log(req.query)
    res.send('Hello')
})

router.post('/signup', async (req, res) => {
    const { name, phone, password, confirmpassword, email} = req.body
    
    
    if (password != confirmpassword) return res.status(200).json(ReponseHandler.errorJson({
        name: name as string,
        phone:phone as string,
        email:email as string,
        errorInput:["confirmpassowrd", "password"]
    }, "password not same", 205));
    
    try{

        const signup = new UserSignupController(name as string, phone as string, password as string, email as string)
        let validate = signup.ValidateFields();
        // if (validate) return res.status(206).json(ReponseHandler.errorJson(validate, validate.message, 206));
        if (validate) throw new CustomException(validate.message ?? "Error validating form", validate, 206)
        let user = await signup.create()
        // if (user.error && user.data) return res.status(206).json(ReponseHandler.errorJson(user.data, (user.data as UserSignupErrorResponse).message, 206)); 
        if (user.error && user.data) throw new CustomException((user.data as UserSignupErrorResponse).message ?? "Error creating User", user.data, 206)
        let postSignup = await signup.postSignup()
        if (!postSignup) throw new CustomException("Server Error", null, 300)
        return res.status(200).json(ReponseHandler.successJson({
            name: name,
            phone: phone,
            email: email,
            token: ""
        },  "User created awaiting verification", 200))
    }
    catch(e)
    {
        let error = e as CustomException
        return res.status(error.code).json(ReponseHandler.errorJson(error.data ?? {
            message: error.message,
            errorcode:error.code
        }, error.message ?? "Server Error", error.code));
    }
    
})

router.post("/verify/phone", async (req, res) => {
    const { code , phone} = req.body
    try{
        if (!code) throw new CustomException("Empty Code", {phone:phone, message:"error valiadting code"}, 206)
        const verified = await UserSignupController.verify(phone, code)
        if(!verified) throw new CustomException("User does not exist", {message: "cant verify user try again later"}, 300)
        if ((!verified?.name || !verified?.phone) && "message" in verified) throw new CustomException(verified?.message, verified, 300)
        const user = verified as User
        return res.status(200).json(ReponseHandler.successJson({
            name: user?.name,
            password: "****",
            email: user.email ?? "",
            verify:user.verify,
            phone: user?.phone
        }, "User phone verification successful", 200))
    }
    catch(e)
    {
        let error = e as CustomException
        return res.status(error.code).json(ReponseHandler.errorJson(error.data ?? {
            message: error.message,
            errorcode: error.code
        }, error.message ?? "Server Error", error.code));
    }
})
export default router;