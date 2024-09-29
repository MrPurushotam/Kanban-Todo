"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (data, expiresIn = "3d") => {
    const token = jsonwebtoken_1.default.sign(data, process.env.SECRET_KEY, { expiresIn });
    return token;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        return Object.assign({ success: true }, data);
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
