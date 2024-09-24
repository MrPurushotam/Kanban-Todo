import mongoose, { Document, Schema } from "mongoose";

export interface Todo extends Document {
    title: string;
    description?: string;
    status: "To Do" | "In Progress" | "Completed";
    priority: "Low" | "Medium" | "High";
    dueDate?: Date;
    workspaceId: mongoose.Types.ObjectId;
}

const todoSchema: Schema<Todo> = new mongoose.Schema(
    {
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
            type: mongoose.Types.ObjectId,
            ref: "Workspace",
            required: true,
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
const Todo = mongoose.model<Todo>("Todo", todoSchema);

export default Todo;
