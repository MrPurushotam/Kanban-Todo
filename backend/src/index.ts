import express from "express";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter.js"
import todoRouter from "./router/todoRouters.js"
import workspaceRouter from "./router/workspaceRouter.js"
import aiRouter from "./router/aiRouter.js"
import { dbConnect } from "./config/db.js";
import { genericRateLimiter } from "./middlewares/genericRateLimiter.js";
import { aiPromptRateLimiter } from "./middlewares/aiRateLimiter.js";

const app = express();
const PORT = process.env.PORT || 3000

// @ts-ignore
app.use(cors({
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json());
app.use(cookieParser())

dbConnect().catch((err: any) => console.error("Database connection error:", err));

app.get("/", (req, res) => {
    res.json({ message: "Api is running." })
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use("/api/v1/user", genericRateLimiter, userRouter)
app.use("/api/v1/todo", genericRateLimiter, todoRouter)
app.use("/api/v1/workspace", genericRateLimiter, workspaceRouter)
app.use("/api/v1/ai", aiPromptRateLimiter, aiRouter);

// Only start the server in development mode
if (process.env.NODE_ENV === "devlopment") {
    app.listen(PORT, () => {
        console.log("Server running on ", PORT)
    })
}

export default app;