import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { api } from '@/lib/api'
import { useSetRecoilState } from 'recoil'
import { workspaceAtom } from '@/states/atoms'
import { Workspace } from '@/types/todo'
import { useToast } from '@/hooks/use-toast'
import CommonToast from './CommonToast'

interface WorkspaceFormProps {
    onCancel: () => void
    isOpen: boolean;
    isUpdating: boolean;
    currentWorkspace?:Workspace | null;
}

const WorkspaceForm: React.FC<WorkspaceFormProps> = ({ currentWorkspace, isUpdating, onCancel, isOpen }) => {
    const [workspaceName, setWorkspaceName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const setWorkspaces=useSetRecoilState(workspaceAtom)
    const { toast } = useToast();

    useEffect(()=>{
        if(isUpdating && currentWorkspace?.id){
            setWorkspaceName(currentWorkspace.name);
        }
    },[currentWorkspace])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (workspaceName.trim()) {
            setIsSubmitting(true)
            try {
                let resp:any;
                if (isUpdating && currentWorkspace?.id) {
                    resp = await api.put("/workspace/", { id: currentWorkspace?.id, newName: workspaceName });
                    if (resp.data.success) {
                        toast({
                            variant:"default",
                            title:"Success",
                            description:"Updated workspace."
                          });
                          setWorkspaces(prev=>prev.filter(workspace=>(workspace.id===currentWorkspace?.id)?{...workspace,name:resp.data.Workspace.name}:workspace))
                    }else{
                        toast({
                            variant:"default",
                            description:"Could not update workspace "+resp.data.error
                          });
                          
                    }
                } else {
                    resp = await api.post("/workspace/", { name: workspaceName })
                    if (resp.data.success) {
                        toast({
                            variant:"default",
                            title:"Success",
                            description:"Created workspace."
                          });
                        setWorkspaces(prev=>[...prev,resp.data.Workspace])
                    }else{
                        toast({
                            variant:"default",
                            description:"Could not create"+resp.data.error
                        });
                    }
                }
                setWorkspaceName('')
            } catch (error:any) {
                console.error('Failed to submit workspace:', error.message)
                toast({
                    variant:"destructive",
                    title:"Error",
                    description:error.message
                  });
                } finally {
                setIsSubmitting(false)
                onCancel();
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {currentWorkspace?.name.trim() ? 'Edit Workspace' : 'Create Workspace'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="workspace-name">Workspace Name</Label>
                        <Input
                            id="workspace-name"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            placeholder="Enter workspace name"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WorkspaceForm