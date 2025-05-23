import mongoose, { Document, Schema } from "mongoose";

export interface Workspace extends Document {
    name: string;
    todos: mongoose.Types.ObjectId[];
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
    createdBy: "User"|"Ai";
}

const workspaceSchema: Schema<Workspace> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            unique: true,
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
        },createdBy: {
            type: String,
            required: [true, "Created by is required."],
            default: "User",
            enum: ["User", "Ai"]
        }   
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
