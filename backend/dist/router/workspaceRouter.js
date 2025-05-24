"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_1 = require("../schema/workspace");
const workspace_2 = __importDefault(require("../models/workspace"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post("/", async (req, res) => {
    try {
        const { success, error, data } = workspace_1.createWorkspace.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ success: false, error: error.flatten() });
        }
        const { name } = data;
        // @ts-expect-error
        const workspace = await workspace_2.default.create({ name, userId: req.userId });
        res.status(200).json({ message: "Workspace created.", Workspace: workspace.toJSON(), success: true });
    }
    catch (error) {
        console.log("Error occured while creating workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ error: "Workspace id cannot be null.", success: false });
        }
        await workspace_2.default.findOneAndDelete({ _id: id });
        res.status(200).json({ message: "Workspace deleted.", success: true });
    }
    catch (error) {
        console.log("Error occured while deleting workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
});
router.put("/", async (req, res) => {
    try {
        const { success, error, data } = workspace_1.updateWorkspace.safeParse(req.body);
        if (!success) {
            return res.status(401).json({ success: false, error: error.flatten() });
        }
        const { id, newName } = data;
        const workspace = await workspace_2.default.findByIdAndUpdate(id, { name: newName }, { new: true });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found.", success: false });
        }
        res.status(200).json({ message: "Workspace updated.", success: true, Workspace: workspace.toJSON() });
    }
    catch (error) {
        console.log("Error occured while updating workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
});
router.get("/", async (req, res) => {
    try {
        // @ts-ignore
        const id = req.userId;
        // @ts-ignore
        if (!id) {
            return res.status(401).json({ success: false, error: "UserId cannot be null" });
        }
        const workspaces = await workspace_2.default.find({ userId: id });
        const workspaceWithId = workspaces.map(w => w.toJSON());
        res.status(200).json({ success: true, Workspaces: workspaceWithId });
    }
    catch (error) {
        console.log("Error occured while fetching workspaces. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
});
exports.default = router;
