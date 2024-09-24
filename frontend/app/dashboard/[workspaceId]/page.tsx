"use client"
import { api } from '@/lib/api'
import { todosAtom, viewTypeAtom, workspaceAtom, isAuthenticatedAtom } from '@/states/atoms'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { ArrowDownNarrowWide, ArrowDownWideNarrow, LayoutPanelTopIcon, ListIcon, PlusIcon } from 'lucide-react'
import dynamic from 'next/dynamic';
import TodoForm from '@/components/dashboard/TodoForm'
import { useToast } from '@/hooks/use-toast'

const ListView = dynamic(() => import("@/components/dashboard/ListView"))
const KanbanView = dynamic(() => import("@/components/dashboard/KanbanView"))


const PrimaryWindow = ({ params }: { params: { workspaceId: string } }) => {
  const [viewType, setViewType] = useRecoilState(viewTypeAtom);
  const workspaces = useRecoilValue(workspaceAtom) || [];
  const setTodos = useSetRecoilState(todosAtom);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentWorkspace = workspaces?.find(w => w.id === params.workspaceId);
  const { toast } = useToast();

  const handleViewChange = (newView: string) => {
    setViewType(newView);
  };
  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/todo/${currentWorkspace?.id}`);
        if (resp.data.success) {
          setTodos(resp.data.todos);
          toast({
            variant: "default",
            title: "Success",
            description: "Fetched Todos."
          });

        } else {
          console.log("Error occured ", resp.data.error);
          toast({
            variant: "default",
            description: "Could not fetch todos " + resp.data.error
          });
        }
      } catch (error: any) {
        console.log("Error occured while fetching data");
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });

      }
      setLoading(false);
    }
    if (currentWorkspace?.id) {
      fetchTodos();
    }
  }, [currentWorkspace?.id, setTodos])

  const toggleSortOrder = () => {
    setSortOrder((prevOrder: string) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };
  return (
    <div className='w-full flex flex-col space-y-3'>
      <h1 className={"font-semibold text-center text-2xl my-2 mx-auto tracking-wide"}>{currentWorkspace?.name || "Default"}</h1>
      <div className='w-full'>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Todos</h1>
          <div className="flex items-center gap-2">
            {viewType === "list" && <Button variant={"outline"} className="flex items-center" onClick={toggleSortOrder}>
              Sort{sortOrder === 'asc' ? <ArrowDownNarrowWide className="mx-1 text-xl h-4 w-4" /> : <ArrowDownWideNarrow className="mx-1 text-xs h-4 w-4" />}
            </Button>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  {viewType === 'list' ? <ListIcon className="h-4 w-4" /> : <LayoutPanelTopIcon className="h-4 w-4" />}
                  <span>{viewType === 'list' ? 'List' : 'Kanban'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>View Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={viewType} onValueChange={handleViewChange}>
                  <DropdownMenuRadioItem value="list">
                    <ListIcon className="h-4 w-4 mr-2" />
                    List
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="kanban">
                    <LayoutPanelTopIcon className="h-4 w-4 mr-2" />
                    Kanban
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Todo
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4">
                <TodoForm workspaceId={currentWorkspace?.id as string} onClose={handleClosePopover} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {/* TODO: add a way to let user choose between list view and kanban view choose any of it will change the ui and render different page thing */}
      {/* TODO: create a list view which shall display all todos in list */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {viewType === 'list' ? (
            // @ts-ignore
            <ListView workspaceId={params.workspaceId} sort={sortOrder} />
          ) : (
            // @ts-ignore
            <KanbanView workspaceId={params.workspaceId} />
          )}
        </>
      )}
    </div>
  )
}

export default PrimaryWindow
