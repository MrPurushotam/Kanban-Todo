import { Request, Response, Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { EnhancedWorkspaceController } from "../utils/systemPrompt";
import Ai from "../models/aiConvo";
import Todo from "../models/todo";
import Workspace from "../models/workspace";
import mongoose from "mongoose";

const router = Router();


router.use(authenticate);

router.post("/generate", async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Expecting { description, projectType, preferences } in req.body
        const { prompt, projectType = 'general', preferences = {} } = req.body;
        const data = await EnhancedWorkspaceController.generateWorkspaceData(prompt, projectType, preferences);
        try {
            // 1. Create Workspace
            const aiWorkspace = new Workspace({
                name: data.workspace_name,
                // @ts-ignore
                userId: req.userId,
                createdBy: "Ai",
            });
            await aiWorkspace.save({ session });

            // 2. Batch create Todos and collect their IDs
            const todoData = data.tasks.map((task: any) => ({
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
            const todoDocs = await Todo.insertMany(todoData, { session });
            const todoIds = todoDocs.map(todo => todo.id);

            // 3. Create Ai document
            const aiTableUpdate = new Ai({
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

        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            console.log("Error saving AI-generated data", error);
            res.status(500).json({
                success: false,
                message: "Error saving AI-generated data",
                error: error.message
            });
        }
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error occured while generating content", error)
        res.status(500).json({
            success: false,
            message: "Error occured while generating content",
            error: error.message
        })
    }
})

router.post("/personalize", async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})



export default router;