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
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const todo_1 = __importDefault(require("../models/todo"));
const newTodoSchema_1 = require("../schema/newTodoSchema");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post("/:workspaceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error, data } = newTodoSchema_1.newTodoSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }
    const { title, description, status, priority, dueDate } = data;
    try {
        const newTodo = new todo_1.default({
            title,
            description,
            status,
            priority,
            dueDate,
            workspaceId: req.params.workspaceId
        });
        yield newTodo.save();
        return res.status(200).json({ success: true, todo: newTodo });
    }
    catch (error) {
        console.log("Error occurred while creating todo ", error === null || error === void 0 ? void 0 : error.message);
        return res.status(500).json({ success: false, message: "Failed to create todo", error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
router.get("/:workspaceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        return res.status(400).json({ error: "WorkspaceId cannot be null.", success: false });
    }
    try {
        const todos = yield todo_1.default.find({ workspaceId });
        const updatedTodos = todos.map(t => t.toJSON());
        return res.status(200).json({ success: true, todos: updatedTodos });
    }
    catch (error) {
        console.log("Error occurred while fetching todos ", error === null || error === void 0 ? void 0 : error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch todos", error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
router.put("/:todoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json({ error: "TodoId cannot be null.", success: false });
    }
    const { success, error, data } = newTodoSchema_1.updateTodoSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ success: false, error: error.flatten() });
    }
    try {
        const updatedTodo = yield todo_1.default.findByIdAndUpdate(todoId, data, { new: true, runValidators: true });
        if (!updatedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        const updatedTodoWithId = updatedTodo.toJSON();
        return res.status(200).json({ success: true, message: "Todo updated successfully", todo: updatedTodoWithId });
    }
    catch (error) {
        console.log("Error occurred while updating todo ", error === null || error === void 0 ? void 0 : error.message);
        return res.status(500).json({ success: false, message: "Failed to update todo", error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
router.delete("/:todoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json({ error: "TodoId cannot be null.", success: false });
    }
    try {
        const deletedTodo = yield todo_1.default.findByIdAndDelete(todoId);
        if (!deletedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        return res.status(200).json({ success: true, message: "Todo deleted successfully" });
    }
    catch (error) {
        console.log("Error occurred while deleting todo ", error === null || error === void 0 ? void 0 : error.message);
        return res.status(500).json({ success: false, message: "Failed to delete todo", error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
exports.default = router;
