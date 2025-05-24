"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(6, { message: "Name cannot be less then 6 character." }).max(30),
    username: zod_1.z.string().min(7, { message: "Username cannot be less then 7 characters." }).max(15),
    password: zod_1.z.string().min(6).max(16),
});
