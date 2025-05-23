import mongoose, { Document, Schema } from "mongoose";

export interface AiConversation extends Document {
    userId?: mongoose.Types.ObjectId;
    projectTitle: string;
    userPrompt: string;
    generatedTodos: mongoose.Types.ObjectId[];
    systemPrompt: string;
    aiResponse?: string;
}

const aiConvoSchema: Schema<AiConversation> = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        projectTitle: { type: String, required: true },
        userPrompt: { type: String, required: true },
        generatedTodos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
        systemPrompt: { type: String, required: false },
        aiResponse: { type: String, required: false }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);
const Ai = mongoose.model<AiConversation>("Ai", aiConvoSchema);

export default Ai;
