"use client"

import { workspaceAtom } from '@/states/atoms'
import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Workspace } from '@/types/todo'
import { BrainCircuit, Briefcase, MoreVertical, Plus, LoaderCircle } from 'lucide-react'
import WorkspaceForm from './WorkspaceForm'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import AiPrompt from './aiPrompt'

// Add styles for the moving border
const PrimaryDashboard = () => {
    const router = useRouter();
    const [workspaces, setWorkspaces] = useRecoilState(workspaceAtom);
    const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingWorkspaceId, setLoadingWorkspaceId] = useState<string | null>(null);
    const { toast } = useToast();

    // Simulate initial data loading
    useEffect(() => {
        const loadWorkspaces = async () => {
            try {
                setInitialLoading(true);
                // You can replace this with your actual API call if needed
                const response = await api.get('/workspace');
                if (response.data.success) {
                    setWorkspaces(response.data.workspaces);
                }
            } catch (error) {
                console.error("Failed to load workspaces:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load your workspaces."
                });
            } finally {
                // Simulate network delay - remove this in production
                setTimeout(() => {
                    setInitialLoading(false);
                }, 1000);
            }
        };
        
        loadWorkspaces();
    }, []);

    const handleWorkspaceClick = (id: String) => {
        setLoadingWorkspaceId(id as string);
        setIsLoading(true);
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
            {/* AI Prompt Dialog */}
            <AiPrompt isOpen={isAiFormOpen} setIsOpen={setIsAiFormOpen} />
            <WorkspaceForm
                isUpdating={editWorkspace ? true : false}
                currentWorkspace={editWorkspace}
                isOpen={isFormOpen}
                onCancel={() => {
                    setEditWorkspace(null);
                    setIsFormOpen(false);
                }}
            />


            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-wide">Your Workspaces</h2>
                <div className="flex items-center gap-2">
                    <div className="relative moving-border">
                        <Button
                            onClick={() => setIsAiFormOpen(true)}
                            variant="default"
                            className="flex items-center gap-1.5 px-3 py-1.5 h-auto text-sm bg-opacity-90 hover:bg-opacity-100 transition-all shadow-sm border-gray-200 text-gray-100 hover:text-gray-200 hover:border-gray-300 whitespace-nowrap relative z-10"
                        >
                            <BrainCircuit className="h-3.5 w-3.5" />
                            Generate Workspace
                        </Button>
                        <span aria-hidden="true"></span>
                    </div>
                    <Button onClick={openCreateForm} variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 h-auto text-sm bg-opacity-90 hover:bg-opacity-100 transition-all shadow-sm border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap">
                        <Plus className="h-3.5 w-3.5" />
                        Create Workspace
                    </Button>
                </div>
            </div>

            <div className="space-y-1 flex flex-col overflow-y-auto">
                {initialLoading ? (
                    // Loading skeleton UI
                    <div className="space-y-2 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {workspaces?.map((workspace) => (
                            <div className='flex justify-between items-center' key={workspace.id}>
                                <Button
                                    onClick={() => handleWorkspaceClick(workspace.id)}
                                    variant="ghost"
                                    className="w-full justify-start"
                                    disabled={isLoading && loadingWorkspaceId === workspace.id}
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    {workspace.name}
                                    {isLoading && loadingWorkspaceId === workspace.id && (
                                        <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                                    )}
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
                                    <h2 className=' break-words text-xl font-semibold text-gray-80'>Yoou have no workspace. Create it asap!</h2>
                                </div>
                            </div>
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default PrimaryDashboard
