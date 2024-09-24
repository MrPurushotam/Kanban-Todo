"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: [true, "Status is required."],
        enum: ["To Do", "In Progress", "Completed"],
    },
    priority: {
        type: String,
        required: [true, "Priority of task is required."],
        enum: ["Low", "Medium", "High"],
    },
    dueDate: {
        type: Date,
    },
    // @ts-ignore
    workspaceId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
const Todo = mongoose_1.default.model("Todo", todoSchema);
exports.default = Todo;
