"use client"

import { workspaceAtom } from '@/states/atoms'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Workspace } from '@/types/todo'
import { Briefcase, MoreVertical, Plus } from 'lucide-react'
import WorkspaceForm from './WorkspaceForm'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const PrimaryDashboard = () => {
    const router = useRouter();
    const [workspaces, setWorkspaces] = useRecoilState(workspaceAtom);
    const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { toast } = useToast();


    const handleWorkspaceClick = (id: String) => {
        router.push(`/dashboard/${id}`);
    }
    const openEditForm = (workspace: Workspace) => {
        setEditWorkspace(workspace);
        setIsFormOpen(true);
    };
    
  const openCreateForm = () => {
    setIsFormOpen(true);
  };

    const deleteWorkspace = async (id: string) => {
        try {
            const resp = await api.delete(`/workspace/${id}`);
            if (resp.data.success) {
                setWorkspaces((prevWorkspaces) => prevWorkspaces.filter(workspace => workspace.id !== id));
                toast({
                    variant: "default",
                    title: "Success",
                    description: "Deleted Workspace."
                });

            } else {
                console.log(resp.data.error)
                toast({
                    variant: "default",
                    description: "Could not delete workspace " + resp.data.error
                });

            }
        } catch (error: any) {

            console.log("Error occured while deleting workspace", error.message)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });

        }
    }

    return (
        <div className='w-3/4 mx-auto p-2 rounded-md space-y-3 mt-7 h-full'>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-wide">Your Workspaces</h2>
                <Button onClick={openCreateForm} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Workspace
                </Button>
            </div>

            <div className="space-y-1 flex flex-col overflow-y-auto">
                {workspaces?.map((workspace) => (
                    <div className='flex justify-between items-center' key={workspace.id}>
                        <Button
                            onClick={() => handleWorkspaceClick(workspace.id)}
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            {workspace.name}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditForm(workspace)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteWorkspace(workspace.id)} className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
                {
                    workspaces?.length < 1 &&
                    <div className="flex gap-2 w-full p-4 rounded-sm shadow-sm ">
                        <div className="w-1/2">
                            <img src={"https://png.pngtree.com/png-vector/20220513/ourmid/pngtree-oops-comic-bubble-sound-text-png-image_4574095.png"} alt="oops!" className='text-center aspect-[3/2] w-70 h-50 object-cover' />
                        </div>
                        <div className="w-1/2 h-50 flex items-center">
                            <Briefcase className="w-8 h-8 text-sky-300" />
                            <h2 className=' break-words text-xl font-semibold text-gray-80'>Yoou have no workspace. Createee it asap!!!</h2>
                        </div>
                    </div>
                }
            </div>

            <WorkspaceForm
                isUpdating={editWorkspace ? true : false}
                currentWorkspace={editWorkspace}
                isOpen={isFormOpen}
                onCancel={() => {
                    setEditWorkspace(null);
                    setIsFormOpen(false);
                }}
            />

        </div>
    )
}

export default PrimaryDashboard
