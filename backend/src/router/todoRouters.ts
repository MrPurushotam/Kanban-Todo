import { Request, Response, Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import Todo from "../models/todo";
import { newTodoSchema, updateTodoSchema } from "../schema/newTodoSchema";

const router = Router();
router.use(authenticate);

router.post("/:workspaceId", async (req: Request, res: Response) => {
    const { success, error, data } = newTodoSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }

    const { title, description, status, priority, dueDate } = data;

    try {
        const newTodo = new Todo({
            title,
            description,
            status,
            priority,
            dueDate,
            workspaceId: req.params.workspaceId
        });

        await newTodo.save();
        return res.status(200).json({ success: true, todo: newTodo });
    } catch (error: any) {
        console.log("Error occurred while creating todo ", error?.message);
        return res.status(500).json({ success: false, message: "Failed to create todo", error: error?.message });
    }
});

router.get("/:workspaceId", async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        return res.status(400).json({ error: "WorkspaceId cannot be null.", success: false });
    }
    try {
        const todos = await Todo.find({ workspaceId });
        const updatedTodos=todos.map(t=>t.toJSON());
        return res.status(200).json({ success: true, todos:updatedTodos });
    } catch (error: any) {
        console.log("Error occurred while fetching todos ", error?.message);
        return res.status(500).json({ success: false, message: "Failed to fetch todos", error: error?.message });
    }
});

router.put("/:todoId", async (req: Request, res: Response) => {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json({ error: "TodoId cannot be null.", success: false });
    }

    const { success, error, data } = updateTodoSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            data,
            { new: true, runValidators: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        const updatedTodoWithId= updatedTodo.toJSON();

        return res.status(200).json({ success: true, message: "Todo updated successfully", todo: updatedTodoWithId });
    } catch (error: any) {
        console.log("Error occurred while updating todo ", error?.message);
        return res.status(500).json({ success: false, message: "Failed to update todo", error: error?.message });
    }
});

router.delete("/:todoId", async (req: Request, res: Response) => {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json({ error: "TodoId cannot be null.", success: false });
    }
    try {
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        return res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error: any) {
        console.log("Error occurred while deleting todo ", error?.message);
        return res.status(500).json({ success: false, message: "Failed to delete todo", error: error?.message });
    }
});

export default router;
