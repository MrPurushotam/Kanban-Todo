import jwt from "jsonwebtoken";

export const createToken=(data:any,expiresIn="3d")=>{
    const token = jwt.sign(data,process.env.SECRET_KEY as string, {expiresIn});
    return token;
}

export const verifyToken=(token:string)=>{
    try {
        const data = jwt.verify( token ,process.env.SECRET_KEY as string) as { userId: string; username: string; email: string };
        return {success:true, ...data}
    } catch (error:any) {
        console.log("Error occured ",error.message);
        if(error.name==="TokenExpiredError"){
            return {success:false, jwtExpire:true}
        }
        return {success:false}
    }
}