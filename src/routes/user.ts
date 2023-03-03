import ReponseHandler from "@utils/responseHandler";
import { UserSignupErrorResponse } from "src/types/response"
import { Router } from "express";
import UserSignupController from "@controllers/usersignup";
import { User } from '../types/modelData'

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
        if (validate) return res.status(206).json(ReponseHandler.errorJson(validate, validate.message, 206));
        let user = await signup.create()
        if (!user.error && user.data) return res.status(206).json(ReponseHandler.errorJson(user.data, (user.data as UserSignupErrorResponse).message, 206)); 
        let postSignup = await signup.postSignup()
        if(!postSignup) throw new Error("Server Error")
        return res.status(200).json(ReponseHandler.successJson({
            name: name,
            phone: phone,
            email: email,
            token: ""
        },  "User created awaiting verification", 200))
    }
    catch(e)
    {
        return res.status(200).json(ReponseHandler.serverErrorJson({
            message: (e as Error).message,
            errorcode:500
        }, "password not same", 205));
    }
    
})
export default router;