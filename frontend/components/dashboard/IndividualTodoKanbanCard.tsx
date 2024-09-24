"use client"
import React from 'react';
import { useDrag } from 'react-dnd';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pen, Trash, EllipsisVertical } from 'lucide-react';
import { Todo } from '@/types/todo';

interface TodoCardProps {
  todo: Todo;
  updateTodo: (id: string, updatedFields: { priority?: string }) => void;
  handleDelete: (todoId: string) => void;
  handleEdit: (todoId: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, updateTodo, handleDelete, handleEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TODO',
    item: { id: todo.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handlePriorityChange = (newPriority: string) => {
    updateTodo(todo.id, { priority: newPriority });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-500";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div 
    // @ts-expect-error
      ref={drag} 
      className={`p-4 rounded-md shadow-md bg-white mb-2 ${isDragging ? 'opacity-50' : ''} 
      sm:p-3 sm:text-sm 
      md:p-4 md:text-base 
      lg:p-5 lg:text-lg`}>
      
      <div className="flex justify-between items-start">
        {/* Title and Due Date */}
        <div>
          <h4 className="font-semibold text-base sm:text-sm md:text-base lg:text-lg">{todo.title}</h4>
          {todo.dueDate && (
            <p className="text-sm text-gray-500 sm:text-xs md:text-sm lg:text-base">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Priority Dropdown & Menu */}
        <div className="flex items-center space-x-2">
          {/* Priority Select */}
          <Select onValueChange={handlePriorityChange} defaultValue={todo.priority}>
            <SelectTrigger className="w-[80px] h-8 text-xs sm:w-[70px] md:w-[100px] lg:w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleEdit(todo.id)}>
                <Pen className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(todo.id)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Priority Text */}
      <p className={`text-xs mt-2 sm:text-xs md:text-sm lg:text-base ${getPriorityColor(todo.priority)}`}>
        Priority: {todo.priority}
      </p>
    </div>
  );
};
