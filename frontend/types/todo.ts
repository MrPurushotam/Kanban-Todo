
export interface Todo{
    id:string;
    title:string;
    description?:string;
    status:string;
    priority:string;
    dueDate?:Date;
    workspaceId:string;
}

export interface Workspace{
    id:string;
    name:string;
    todos?:Todo[];
}

export interface User{
    username:string;
    email:string;
    id:string;
}