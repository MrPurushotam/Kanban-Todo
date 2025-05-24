"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
}
const createToken = (data, expiresIn = "3d") => {
    // jwt.sign expects expiresIn to be a string (like "3d") or a number (seconds)
    // The error is likely due to a mismatch in the type expected by the version of @types/jsonwebtoken
    // So, cast expiresIn to 'any' to satisfy the type checker
    const token = jsonwebtoken_1.default.sign(data, SECRET_KEY, { expiresIn: expiresIn });
    return token;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        const data = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        return { success: true, ...data };
    }
    catch (error) {
        console.log("Error occured ", error.message);
        if (error.name === "TokenExpiredError") {
            return { success: false, jwtExpire: true };
        }
        return { success: false };
    }
};
exports.verifyToken = verifyToken;
