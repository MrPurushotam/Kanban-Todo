"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please provide a valid email."],
    },
    username: {
        type: String,
        required: [true, "Username is required."],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    workspaces: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Workspace" }],
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
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
