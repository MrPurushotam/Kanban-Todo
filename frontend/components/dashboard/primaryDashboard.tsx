"use client"

import { workspaceAtom, globalLoadingAtom } from '@/states/atoms'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
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
    const [loadingWorkspaceId, setLoadingWorkspaceId] = useState<string | null>(null);
    const globalLoading = useRecoilValue(globalLoadingAtom);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleWorkspaceClick = (id: String) => {
        setLoadingWorkspaceId(id as string);
        setIsLoading(true);
        router.push(`/dashboard/${id}`);
    }
    const openEditForm = (workspace: Workspace) => {
        setOpenDropdownId(null);

        setEditWorkspace(workspace);
        setIsFormOpen(true);
        console.log("Edit form triggered for:", workspace.name);
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

    // Skeleton loader component
    const WorkspaceSkeleton = () => (
        <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center animate-pulse">
                    <div className="flex items-center space-x-2 w-full">
                        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className='w-full max-w-3xl mx-auto p-2 rounded-md space-y-3 mt-7 h-full'>
            {/* AI Prompt Dialog */}
            <WorkspaceForm
                isUpdating={editWorkspace ? true : false}
                currentWorkspace={editWorkspace}
                isOpen={isFormOpen}
                onCancel={() => {
                    setEditWorkspace(null);
                    setIsFormOpen(false);
                }}
            />
            <AiPrompt isOpen={isAiFormOpen} setIsOpen={setIsAiFormOpen} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                    Your Workspaces
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                    {/* AI Generate Button */}
                    <div className="relative moving-border">
                        <Button
                            onClick={() => setIsAiFormOpen(true)}
                            className="relative z-10 flex items-center gap-2
                                px-4 py-2 h-10
                                text-sm font-medium
                                bg-gray-900 text-white
                                hover:bg-gray-800 transition-all
                                shadow-sm
                                whitespace-nowrap shrink-0"
                        >
                            <BrainCircuit className="h-4 w-4 shrink-0" />
                            <span>Generate</span>
                            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                                AI
                            </span>
                        </Button>
                        {/* <span aria-hidden="true" /> */}
                    </div>

                    {/* Manual Create Button */}
                    <Button
                        onClick={openCreateForm}
                        variant="outline"
                        className="flex items-center gap-2 rounded-md
                 px-3 sm:px-4 py-2 text-sm font-medium
                 border-gray-300 text-gray-800
                 hover:bg-gray-900 hover:text-white hover:border-gray-900
                 transition-all whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden xs:inline">New Workspace</span>
                        <span className="xs:hidden">New</span>
                    </Button>
                </div>
            </div>


            <div className="space-y-1 flex flex-col overflow-y-auto">
                {globalLoading === "loading-workspaces" ? (
                    <WorkspaceSkeleton />
                ) : (
                    <>
                        {workspaces?.map((workspace) => (
                            <div className='flex justify-between items-center' key={workspace.id}>
                                <Button
                                    onClick={() => handleWorkspaceClick(workspace.id)}
                                    variant="ghost"
                                    className="w-full justify-start text-xs sm:text-sm px-2 sm:px-4"
                                    disabled={isLoading && loadingWorkspaceId === workspace.id}
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span className="truncate">{workspace.name}</span>
                                    {isLoading && loadingWorkspaceId === workspace.id && (
                                        <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                                    )}
                                </Button>
                                <DropdownMenu
                                    open={openDropdownId === workspace.id}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setOpenDropdownId(workspace.id);
                                        } else {
                                            setOpenDropdownId(null);
                                        }
                                    }}
                                >
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
                            workspaces?.length < 1 && globalLoading !== "loading-workspaces" &&
                            <div className="flex flex-col sm:flex-row gap-2 w-full p-4 rounded-sm shadow-sm items-center">
                                <div className="w-full sm:w-1/2 flex justify-center mb-2 sm:mb-0">
                                    <img src={"https://png.pngtree.com/png-vector/20220513/ourmid/pngtree-oops-comic-bubble-sound-text-png-image_4574095.png"} alt="oops!" className='aspect-[3/2] w-40 sm:w-70 h-32 sm:h-50 object-cover' />
                                </div>
                                <div className="w-full sm:w-1/2 h-32 sm:h-50 flex flex-col justify-center items-center sm:items-start">
                                    <Briefcase className="w-8 h-8 text-sky-300 mb-2" />
                                    <h2 className='break-words text-base sm:text-xl font-semibold text-gray-800 text-center sm:text-left'>You have no workspace. Create it asap!</h2>
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
