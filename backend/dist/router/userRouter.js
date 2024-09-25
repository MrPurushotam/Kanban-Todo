"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const signinSchema_1 = require("../schema/signinSchema");
const user_1 = __importDefault(require("../models/user"));
const jwtFunctions_1 = require("../utils/jwtFunctions");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const signupSchema_1 = require("../schema/signupSchema");
require("dotenv/config");
const router = (0, express_1.Router)();
// @ts-epect-error
const sameSiteAttribute = process.env.SAME_SITE || "none";
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error, data } = signinSchema_1.signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }
    const { email, password } = data;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials.", success: false });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials.", success: false });
        }
        const userWithId = user.toJSON();
        const token = (0, jwtFunctions_1.createToken)({ userId: userWithId.id, username: userWithId.username, email: userWithId.email });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, maxAge: 3 * 60 * 60 * 1000, path: '/' });
        res.cookie("authenticate", true, { secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, path: '/', maxAge: 3 * 60 * 60 * 1000 });
        res.status(200).json({ success: true, message: "Login successful" });
    }
    catch (error) {
        console.log("Error occured while signin in.", error.message);
        return res.status(500).json({ success: false, messsage: "Internal error", error: error.message });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, error } = signupSchema_1.signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }
    const { name, email, username, password } = data;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists.", success: false });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.default({
            name,
            email,
            username,
            password: hashedPassword,
        });
        yield newUser.save();
        const userWithId = newUser.toJSON();
        const token = (0, jwtFunctions_1.createToken)({ userId: userWithId.id, username: userWithId.username, email: userWithId.email });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, maxAge: 3 * 60 * 60 * 1000, path: '/' });
        res.cookie("authenticate", true, { secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, path: '/', maxAge: 3 * 60 * 60 * 1000 });
        return res.status(201).json({ message: "Signup successful.", success: true, });
    }
    catch (error) {
        console.error("Error during signup:", error === null || error === void 0 ? void 0 : error.message);
        return res.status(500).json({ message: "Internal server error.", error: error.message, success: false });
    }
}));
router.get("/logout", (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, maxAge: 3 * 60 * 60 * 1000, path: '/' });
    res.clearCookie("authenticate", { secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, path: '/', maxAge: 3 * 60 * 60 * 1000 });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.get("/", authMiddleware_1.authenticate, (req, res) => {
    // @ts-ignore
    res.status(200).json({ message: "Fetched user details.", success: true, user: { id: req.userId, email: req.email, username: req.username } });
});
exports.default = router;
