import express from "express";
import cors from "cors"
import 'dotenv/config'
import userRouter from "./router/userRouter"
import todoRouter from "./router/todoRouters"
import workspaceRouter from "./router/workspaceRouter"
import aiRouter from "./router/aiRouter"
import { dbConnect } from "./config/db";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000

// @ts-ignore
app.use(cors({
    origin: process.env.FRONTEND_URL?.split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json());
app.use(cookieParser())
dbConnect();

app.get("/", (req, res) => {
    res.json({ message: "Api is running." })
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/todo", todoRouter)
app.use("/api/v1/workspace", workspaceRouter)
app.use("/api/v1/ai", aiRouter)

app.listen(PORT, () => {
    console.log("Server running on ", PORT)
})
