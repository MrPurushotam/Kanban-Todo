"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const systemPrompt_1 = require("../utils/systemPrompt");
const aiConvo_1 = __importDefault(require("../models/aiConvo"));
const todo_1 = __importDefault(require("../models/todo"));
const workspace_1 = __importDefault(require("../models/workspace"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post("/generate", async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Expecting { description, projectType, preferences } in req.body
        const { prompt, projectType = 'general', preferences = {} } = req.body;
        const data = await systemPrompt_1.EnhancedWorkspaceController.generateWorkspaceData(prompt, projectType, preferences);
        try {
            // 1. Create Workspace
            const aiWorkspace = new workspace_1.default({
                name: data.workspace_name,
                // @ts-ignore
                userId: req.userId,
                createdBy: "Ai",
            });
            await aiWorkspace.save({ session });
            // 2. Batch create Todos and collect their IDs
            const todoData = data.tasks.map((task) => ({
                title: task.title,
                description: task.description,
                status: task.status || "To Do",
                workspaceId: aiWorkspace.id,
                // @ts-ignore
                userId: req.userId,
                createdBy: "Ai",
                priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase() || "Low",
                dueDate: task.dueDate || null,
            }));
            const todoDocs = await todo_1.default.insertMany(todoData, { session });
            const todoIds = todoDocs.map(todo => todo.id);
            // 3. Create Ai document
            const aiTableUpdate = new aiConvo_1.default({
                // @ts-ignore
                userId: req.userId,
                projectTitle: data.workspace_name,
                userPrompt: prompt,
                generatedTodos: todoIds,
                // systemPrompt: data.systemPrompt,
                // aiResponse: data
            });
            await aiTableUpdate.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({
                success: true,
                workspace: aiWorkspace,
                todos: todoDocs,
                ai: aiTableUpdate,
                data
            });
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log("Error saving AI-generated data", error);
            res.status(500).json({
                success: false,
                message: "Error saving AI-generated data",
                error: error.message
            });
        }
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error occured while generating content", error);
        res.status(500).json({
            success: false,
            message: "Error occured while generating content",
            error: error.message
        });
    }
});
router.post("/personalize", async (req, res) => {
    try {
    }
    catch (error) {
    }
});
exports.default = router;
