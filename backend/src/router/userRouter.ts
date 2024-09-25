import bcrypt from "bcryptjs"
import { Request, Response, Router } from "express";
import { signinSchema } from "../schema/signinSchema";
import User from "../models/user";
import { createToken } from "../utils/jwtFunctions";
import { authenticate } from "../middlewares/authMiddleware";
import { signupSchema } from "../schema/signupSchema";
import "dotenv/config"
const router = Router();
// @ts-epect-error
const sameSiteAttribute = process.env.SAME_SITE as string

router.post("/login", async (req: Request, res: Response) => {
    const { success, error, data } = signinSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() })
    }
    const { email, password } = data;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials.", success: false })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials.", success: false })
        }
        const userWithId = user.toJSON();
        const token = createToken({ userId: userWithId.id, username: userWithId.username, email: userWithId.email });
        // @ts-expect-error
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, maxAge: 3 * 60 * 60 * 1000,path: '/'});
        res.cookie("authenticate", true, { secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
        res.status(200).json({ success: true, message: "Login successful" });
    } catch (error: any) {
        console.log("Error occured while signin in.", error.message)
        return res.status(500).json({ success: false, messsage: "Internal error", error: error.message });
    }
})

router.post("/signup", async (req: Request, res: Response) => {
    const { success, data, error } = signupSchema.safeParse(req.body)

    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() })
    }

    const { name, email, username, password } = data;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists.", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        const userWithId = newUser.toJSON();
        const token = createToken({ userId: userWithId.id, username: userWithId.username, email: userWithId.email });
        // @ts-expect-error
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: sameSiteAttribute, maxAge: 3 * 60 * 60 * 1000,path: '/'});
        res.cookie("authenticate", true, { secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
        return res.status(201).json({ message: "Signup successful.", success: true, });
    } catch (error: any) {
        console.error("Error during signup:", error?.message);
        return res.status(500).json({ message: "Internal server error.", error: error.message, success: false });
    }
});

router.get("/logout", (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path:"/"
    });

    res.clearCookie('authenticate', {secure: process.env.NODE_ENV === 'production',sameSite:"lax",path:'/'});
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.get("/", authenticate, (req: Request, res: Response) => {
    // @ts-ignore
    res.status(200).json({ message: "Fetched user details.", success: true, user: { id: req.userId, email: req.email, username: req.username } })
})


export default router;