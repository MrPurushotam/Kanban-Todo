import {z} from "zod";


export const createWorkspace=z.object({
    name:z.string().min(3,{message:"Workspace name can't be less then 3 letters."}).max(16,{message:"Workspace name can't be greater then 16 letters."}),
})

export const updateWorkspace = z.object({
    id:z.string(),
    newName:z.string().min(3,{message:"Workspace name can't be less then 3 letters."}).max(16,{message:"Workspace name can't be greater then 16 letters."}),
})