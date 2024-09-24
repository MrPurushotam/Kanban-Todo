import { Request, Response, Router } from "express";
import { createWorkspace, updateWorkspace } from "../schema/workspace";
import Workspace from "../models/workspace";
import { authenticate } from "../middlewares/authMiddleware";

const router= Router();

router.use(authenticate)
router.post("/",async(req:Request,res:Response)=>{
    try {
        const {success,error,data}= createWorkspace.safeParse(req.body);
        if(!success){
            return res.status(400).json({success:false,error:error.flatten()})
        }
        const {name}=data;
        // @ts-expect-error
        const workspace = await Workspace.create({ name, userId: req.userId });
        res.status(200).json({message:"Workspace created.",Workspace:workspace.toJSON(),success:true})
    } catch (error:any) {
        console.log("Error occured while creating workspace. ",error.message);
        res.status(500).json({message:"Internal Error.",error:error.message,success:false})
    }
})

router.delete("/:id",async(req:Request,res:Response)=>{
    try {
        const id= req.params.id;
        if(!id){
            return res.status(401).json({error:"Workspace id cannot be null.",success:false});
        }
        await Workspace.findOneAndDelete({_id:id});
        res.status(200).json({message:"Workspace deleted.",success:true})
    } catch (error:any) {
        console.log("Error occured while deleting workspace. ",error.message);
        res.status(500).json({message:"Internal Error.",error:error.message,success:false})
    }
})

router.put("/",async(req:Request,res:Response)=>{
    try {
        const {success,error,data}= updateWorkspace.safeParse(req.body);
        if(!success){
            return res.status(401).json({success:false,error:error.flatten()})
        }
        const {id,newName}=data;
        const workspace = await Workspace.findByIdAndUpdate(id, { name: newName }, { new: true });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found.", success: false });
        }
        
        res.status(200).json({message:"Workspace updated.",success:true,Workspace:workspace.toJSON()})
    } catch (error:any) {
        console.log("Error occured while updating workspace. ",error.message);
        res.status(500).json({message:"Internal Error.",error:error.message,success:false})
    }    
})

router.get("/",async(req:Request,res:Response)=>{
    try {
        // @ts-ignore
        const id= req.userId as string;
        // @ts-ignore
        console.log(req.userId as string)
        if(!id){
            return res.status(401).json({success:false,error:"UserId cannot be null"});
        }
        const workspaces = await Workspace.find({ userId:id }); 
        const workspaceWithId = workspaces.map(w => w.toJSON()); 
        res.status(200).json({ success: true, Workspaces: workspaceWithId });
    } catch (error:any) {
        console.log("Error occured while fetching workspaces. ",error.message);
        res.status(500).json({message:"Internal Error.",error:error.message,success:false})
        
    }    
})

export default router;