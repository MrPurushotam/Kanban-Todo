// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import {verifyToken} from "../utils/jwtFunctions";

export function authenticate(req:Request,res:Response,next:NextFunction){
    const cookieAuthToken=req.cookies.token
    if(!cookieAuthToken){
        return res.status(401).json({error:'User Unauthorized.',success:false})
    }
    const data= verifyToken(cookieAuthToken);
    if(data.success){
        req.userId=data.userId
        req.username=data.username
        req.email=data.email
        return next()  
    }
    
    if(!data.success && data.jwtExpire){
        console.log("JWT Expired - Clearing cookie")
        res.clearCookie("token");
        res.clearCookie("authenticate");
        return res.status(400).json({error:"Jwt Expired",success:false})
    }
    return res.status(400).json({error:"Session expired.",success:false})
}

