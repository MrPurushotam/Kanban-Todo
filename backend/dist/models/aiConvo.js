"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aiConvoSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    projectTitle: { type: String, required: true },
    userPrompt: { type: String, required: true },
    generatedTodos: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Todo" }],
    systemPrompt: { type: String, required: false },
    aiResponse: { type: String, required: false }
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
const Ai = mongoose_1.default.model("Ai", aiConvoSchema);
exports.default = Ai;
