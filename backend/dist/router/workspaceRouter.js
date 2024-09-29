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
const workspace_1 = require("../schema/workspace");
const workspace_2 = __importDefault(require("../models/workspace"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success, error, data } = workspace_1.createWorkspace.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ success: false, error: error.flatten() });
        }
        const { name } = data;
        // @ts-expect-error
        const workspace = yield workspace_2.default.create({ name, userId: req.userId });
        res.status(200).json({ message: "Workspace created.", Workspace: workspace.toJSON(), success: true });
    }
    catch (error) {
        console.log("Error occured while creating workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ error: "Workspace id cannot be null.", success: false });
        }
        yield workspace_2.default.findOneAndDelete({ _id: id });
        res.status(200).json({ message: "Workspace deleted.", success: true });
    }
    catch (error) {
        console.log("Error occured while deleting workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
}));
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success, error, data } = workspace_1.updateWorkspace.safeParse(req.body);
        if (!success) {
            return res.status(401).json({ success: false, error: error.flatten() });
        }
        const { id, newName } = data;
        const workspace = yield workspace_2.default.findByIdAndUpdate(id, { name: newName }, { new: true });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found.", success: false });
        }
        res.status(200).json({ message: "Workspace updated.", success: true, Workspace: workspace.toJSON() });
    }
    catch (error) {
        console.log("Error occured while updating workspace. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const id = req.userId;
        // @ts-ignore
        if (!id) {
            return res.status(401).json({ success: false, error: "UserId cannot be null" });
        }
        const workspaces = yield workspace_2.default.find({ userId: id });
        const workspaceWithId = workspaces.map(w => w.toJSON());
        res.status(200).json({ success: true, Workspaces: workspaceWithId });
    }
    catch (error) {
        console.log("Error occured while fetching workspaces. ", error.message);
        res.status(500).json({ message: "Internal Error.", error: error.message, success: false });
    }
}));
exports.default = router;
