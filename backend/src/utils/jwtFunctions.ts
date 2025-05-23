import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}


export const createToken = (data: any, expiresIn: string | number = "3d") => {
    // jwt.sign expects expiresIn to be a string (like "3d") or a number (seconds)
    // The error is likely due to a mismatch in the type expected by the version of @types/jsonwebtoken
    // So, cast expiresIn to 'any' to satisfy the type checker
    const token = jwt.sign(
        data,
        SECRET_KEY as jwt.Secret,
        { expiresIn: expiresIn as any }
    );
    return token;
}

export const verifyToken = (token: string) => {
    try {
        const data = jwt.verify(token, SECRET_KEY as string) as { userId: string; username: string; email: string };
        return { success: true, ...data }
    } catch (error: any) {
        console.log("Error occured ", error.message);
        if (error.name === "TokenExpiredError") {
            return { success: false, jwtExpire: true }
        }
        return { success: false }
    }
}