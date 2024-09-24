"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workspaceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        unique: true, // Keep it unique globally, or remove this if uniqueness is user-specific
        trim: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    todos: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Todo" }],
        default: [],
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
const Workspace = mongoose_1.default.model("Workspace", workspaceSchema);
exports.default = Workspace;
