"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const userRouter_1 = __importDefault(require("./router/userRouter"));
const todoRouters_1 = __importDefault(require("./router/todoRouters"));
const workspaceRouter_1 = __importDefault(require("./router/workspaceRouter"));
const db_1 = require("./config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, db_1.dbConnect)();
app.get("/", (req, res) => {
    res.json({ message: "Api is running." });
});
app.use("/api/v1/user", userRouter_1.default);
app.use("/api/v1/todo", todoRouters_1.default);
app.use("/api/v1/workspace", workspaceRouter_1.default);
app.listen(PORT, () => {
    console.log("Server running on ", PORT);
});
