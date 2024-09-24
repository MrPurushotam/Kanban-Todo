"use client"
import React, { useState } from 'react'
import IndividualTodoCard from './IndividualTodoCard'
import { useRecoilState } from 'recoil'
import { todosAtom } from '@/states/atoms'
import { Todo } from '@/types/todo'
import EditTodoComponent from './EditTodo'
import { api } from '@/lib/api'
import { SquareCheckBig } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface listViewProps {
    workspaceId: string;
    sort: string;
}
const ListView = ({ workspaceId, sort }: listViewProps) => {
    const [todos, setTodos] = useRecoilState(todosAtom);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
    const { toast }=useToast();
    const editTodo = (id: string) => {
        const todoToEdit = todos.find(todo => todo.id === id)
        if (todoToEdit) {
            setSelectedTodo(todoToEdit);
        }
    }

    const getTodoScore = (todo: Todo) => {
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 }[todo.priority] || 0;
        const statusScore = { 'Not Started': 3, 'In Progress': 2, 'Completed': 1 }[todo.status] || 0;
        return priorityScore + statusScore;
    }
    const deleteTodo = async (id: string) => {
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
                console.log("Some error ocurred while deleting.", resp.data.error);
                toast({
                    variant: "default",
                    description: "Could not delete todo. " + resp.data.error
                });
            }
        } catch (error: any) {
            console.log("Some error occured while deleting.", error.message)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        }
    }

    const updateTodo = async (id: string, data: { status?: string; priority?: string }) => {
        const updateFields: { status?: string, priority?: string } = {};
        if (data.status) updateFields.status = data.status;
        if (data.priority) updateFields.priority = data.priority;
        try {
            const resp = await api.put(`/todo/${id}`, updateFields);
            if (resp.data.success) {
                setTodos(prevTodos => {
                    return (prevTodos.map(todo => (todo.id === id ? resp.data.todo : todo)))
                })
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
            console.log("Some error occured while updating.", error.message)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
              });
        }
    }
    const handleCloseEditModal = () => {
        setSelectedTodo(null)
    }

    const sortedTodos = [...todos].sort((a, b) => {
        const scoreA = getTodoScore(a);
        const scoreB = getTodoScore(b);
        return sort === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    });
    return (
        <div className='min-h-70 h-[95vh] overflow-y-auto overflow-x-hidden p-2 space-y-1'>
            {
                sortedTodos.map((todo, index) => {
                    return (
                        <IndividualTodoCard id={todo.id} key={index} dueDate={todo.dueDate} onEdit={() => editTodo(todo.id)} onDelete={() => deleteTodo(todo.id)} priority={todo.priority} status={todo.status} title={todo.title} description={todo.description} updateTodo={updateTodo} />
                    )
                })
            }
            {
                sortedTodos.length < 1 &&
                <div className="flex gap-2 w-full p-4 rounded-sm shadow-sm">
                    <div className="w-1/2">
                        <img src={"https://png.pngtree.com/png-vector/20220513/ourmid/pngtree-oops-comic-bubble-sound-text-png-image_4574095.png"} alt="oops!" className='text-center aspect-[3/2] w-70 h-50 object-cover' />
                    </div>
                    <div className="w-1/2 h-50 flex items-center">
                        <SquareCheckBig className="w-8 h-8 text-sky-300" />
                        <h2 className=' break-words text-xl font-semibold text-gray-80'>Yoou have no todso in this id. Createee it asap!!!</h2>
                    </div>
                </div>
            }
            {selectedTodo && (
                <EditTodoComponent
                    todo={selectedTodo}
                    isOpen={(selectedTodo.id).trim() !== ""}
                    onClose={handleCloseEditModal}
                />
            )}
        </div>
    )
}

export default ListView
