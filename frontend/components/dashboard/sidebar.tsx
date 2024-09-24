"use client"

import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Menu, Briefcase, LogOut, Plus, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Workspace } from '@/types/todo'
import { SidebarAtom } from '@/states/SidebarAtoms'
import { userDetailsAtom, workspaceAtom } from '@/states/atoms'
import { useRouter } from 'next/navigation'
import WorkspaceForm from './WorkspaceForm';
import { api } from '@/lib/api';
import { useLogout } from '@/hooks/useLogoutUser';
import { useToast } from '@/hooks/use-toast';


const Sidebar = () => {
  const logout = useLogout();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(SidebarAtom);
  const [workspaces, setWorkspaces] = useRecoilState(workspaceAtom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const loggedUser = useRecoilValue(userDetailsAtom);
  const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  const { toast } = useToast();

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/dashboard/${workspaceId}`);
    setIsSidebarOpen(false);
  };

  const openCreateForm = () => {
    setIsFormOpen(true);
    setIsSidebarOpen(false);
  };

  const openEditForm = (workspace: Workspace) => {
    setEditWorkspace(workspace);
    setIsFormOpen(true);
    setIsSidebarOpen(false);
  };

  const deleteWorkspace = async (id: string) => {
    try {
      const resp = await api.delete(`/workspace/${id}`);
      if (resp.data.success) {
        setWorkspaces((prevWorkspaces) => prevWorkspaces.filter(workspace => workspace.id !== id));
        toast({
          variant: "default",
          title: "Success",
          description: "Deleted workspace."
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
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback onClick={() => !isSidebarOpen && toggleSidebar()}>{loggedUser?.username.charAt(0) || "D"}</AvatarFallback>
          </Avatar>
          {isSidebarOpen && (
            <div>
              <p className="text-sm font-medium">{loggedUser?.username || "Default"}</p>
              <p className="text-xs text-muted-foreground">{loggedUser?.email || "email@email.com"}</p>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-between items-center">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-normal my-2">
            {isSidebarOpen ? "Workspaces" : <Briefcase className="h-4 w-4 " onClick={() => !isSidebarOpen && toggleSidebar()} />}
          </h2>

          {isSidebarOpen && <Button variant="ghost" size="icon" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
          </Button>}
        </div>
        <div className="space-y-1 flex flex-col overflow-y-auto">
          {isSidebarOpen && workspaces?.map((workspace) => (
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
        </div>
      </div>
      <Separator />
      <div className="p-4 bottom-1 w-full">
        <Button variant="ghost" className={`flex ${isSidebarOpen ? "justify-start" : "w-fit justify-start items-center text-center text-2xl"}`} onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          {isSidebarOpen && "Logout"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* @ts-ignore */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className={`hidden md:flex h-screen ${isSidebarOpen ? 'w-64' : 'w-16'} flex-col border-r transition-all duration-300`}>
        <SidebarContent />
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
    </>
  )
}

export default Sidebar;