import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    workspaces: mongoose.Schema.Types.ObjectId[];
}

const userSchema: Schema<User> = new mongoose.Schema(
    {
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
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
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

const User = mongoose.model<User>("User", userSchema);

export default User;
