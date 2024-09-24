"use client"
import { todosAtom } from '@/states/atoms';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useDrop } from 'react-dnd';
import { TodoCard } from './IndividualTodoKanbanCard';
import { Button } from '../ui/button';
import { ArrowDownNarrowWide, ArrowDownWideNarrow } from 'lucide-react';
import { Todo } from '@/types/todo';
import EditTodoComponent from './EditTodo';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface KanbanViewProps {
  workspaceId: string;
}

const KanbanView = ({ workspaceId }: KanbanViewProps) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [todos, setTodos] = useRecoilState(todosAtom);
  const todoRef = useRef<HTMLInputElement>(null);
  const inProgressRef = useRef<HTMLInputElement>(null);
  const completedRef = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  const handleEditTodo = (id: string) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setSelectedTodo(todoToEdit);
    }
  };

  const handleTodoDelete = async (id: String) => {
    try {
      const resp = await api.delete(`/todo/${id}`);
      if (resp.data.success) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        toast({
          variant: "default",
          title: "Success",
          description: "Deleted todo."
        });
      } else {
        console.log("Some error occurred while deleting.", resp.data.error);
        toast({
          variant: "default",
          description: "Could not delete todo. " + resp.data.error
        });
      }
    } catch (error: any) {
      console.log("Some error occurred while deleting.", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });

    }
  };

  const handleCloseEditModal = () => {
    setSelectedTodo(null);
  };

  const updateTodo = async (id: string, data: { status?: string; priority?: string }) => {
    const updateFields: { status?: string, priority?: string } = {};
    if (data.status) updateFields.status = data.status;
    if (data.priority) updateFields.priority = data.priority;
    try {
      const resp = await api.put(`/todo/${id}`, updateFields);
      if (resp.data.success) {
        setTodos(prevTodos => (
          prevTodos.map(todo => (todo.id === id ? resp.data.todo : todo))
        ));
        toast({
          variant: "default",
          title: "Success",
          description: "Updated Todo."
        });
      } else {
        console.log(resp.data.error);
        toast({
          variant: "default",
          description: "Could not update todos " + resp.data.error
        });

      }
    } catch (error: any) {
      console.log("Some error occurred while updating.", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });

    }
  };

  const DropZone = ({ status, children }: { status: string, children: React.ReactNode }) => {
    const [, drop] = useDrop({
      accept: 'TODO',
      drop: (item: { id: string }) => handleDrop(item.id, status),
    });
    return (
      // @ts-expect-error
      <div ref={drop} className="w-full min-h-[200px] bg-gray-100 p-4 rounded-md">
        {children}
      </div>
    );
  };

  const handleDrop = async (todoId: string, status: string) => {
    setTodos(prevTodos => (
      prevTodos.map(todo => (todo.id === todoId ? { ...todo, status } : todo))
    ));
    await updateTodo(todoId, { status });
  };

  const getPriorityValue = (priority: string) => {
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const getSortedTodos = (status: string) => {
    return todos
      .filter(todo => todo.status === status)
      .sort((a, b) => {
        const priorityA = getPriorityValue(a.priority);
        const priorityB = getPriorityValue(b.priority);
        return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      });
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 h-[85vh]`}>
      <DropZone status="To Do">
        <div ref={todoRef} className="w-full h-full p-2 border-2 border-blue-500 rounded-md space-y-3 overflow-auto">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-semibold tracking-wide text-blue-700 text-lg md:text-xl">To Do's</h2>
            <Button variant="outline" className="flex items-center" onClick={toggleSortOrder}>
              Sort {sortOrder === 'asc' ? <ArrowDownNarrowWide className="mx-1 text-xs md:text-xl h-4 w-4" /> : <ArrowDownWideNarrow className="mx-1 text-xs h-4 w-4" />}
            </Button>
          </div>
          {getSortedTodos('To Do').map(todo => (
            <TodoCard updateTodo={updateTodo} key={todo.id} todo={todo} handleEdit={handleEditTodo} handleDelete={handleTodoDelete} />
          ))}
        </div>
      </DropZone>

      <DropZone status="In Progress">
        <div ref={inProgressRef} className="w-full h-full p-2 border-2 border-yellow-500 rounded-md space-y-3 overflow-auto">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-semibold tracking-wide text-yellow-700 text-lg md:text-xl">In Progress</h2>
            <Button variant="outline" className="flex items-center" onClick={toggleSortOrder}>
              Sort {sortOrder === 'asc' ? <ArrowDownNarrowWide className="mx-1 text-xs md:text-xl h-4 w-4" /> : <ArrowDownWideNarrow className="mx-1 text-xs h-4 w-4" />}
            </Button>
          </div>
          {getSortedTodos('In Progress').map(todo => (
            <TodoCard updateTodo={updateTodo} key={todo.id} todo={todo} handleEdit={handleEditTodo} handleDelete={handleTodoDelete} />
          ))}
        </div>
      </DropZone>

      <DropZone status="Completed">
        <div ref={completedRef} className="w-full h-full p-2 border-2 border-green-500 rounded-md space-y-3 overflow-auto">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-semibold tracking-wide text-green-700 text-lg md:text-xl">Completed</h2>
            <Button variant="outline" className="flex items-center" onClick={toggleSortOrder}>
              Sort {sortOrder === 'asc' ? <ArrowDownNarrowWide className="mx-1 text-xs md:text-xl h-4 w-4" /> : <ArrowDownWideNarrow className="mx-1 text-xs h-4 w-4" />}
            </Button>
          </div>
          {getSortedTodos('Completed').map(todo => (
            <TodoCard updateTodo={updateTodo} key={todo.id} todo={todo} handleEdit={handleEditTodo} handleDelete={handleTodoDelete} />
          ))}
        </div>
      </DropZone>

      {selectedTodo && (
        <EditTodoComponent
          todo={selectedTodo}
          isOpen={(selectedTodo.id).trim() !== ""}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default KanbanView;
