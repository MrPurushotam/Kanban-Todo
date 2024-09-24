import mongoose, { Document, Schema } from "mongoose";

export interface Workspace extends Document {
    name: string;
    todos: mongoose.Types.ObjectId[];
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
}

const workspaceSchema: Schema<Workspace> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            unique: true, // Keep it unique globally, or remove this if uniqueness is user-specific
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        todos: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
            default: [],
        },
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

const Workspace = mongoose.model<Workspace>("Workspace", workspaceSchema);

export default Workspace;
