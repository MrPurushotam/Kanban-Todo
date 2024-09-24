"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IndividualTodoCardProps {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  onEdit: () => void;
  onDelete: () => void;
  updateTodo: (id: string, updatedFields: { status?: string; priority?: string }) => void;
}

export default function IndividualTodoCard({ id, title, description, status, priority, dueDate, onEdit, onDelete, updateTodo }: IndividualTodoCardProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedPriority, setSelectedPriority] = useState(priority);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  useEffect(() => {
    setSelectedPriority(priority);
  }, [priority]);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    updateTodo(id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: string) => {
    setSelectedPriority(newPriority);
    updateTodo(id, { priority: newPriority });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-500 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between p-4 space-y-4 sm:space-y-0">
        <div className="flex-grow">
          <CardTitle className="text-lg font-semibold mb-1">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-gray-600">
              {description}
            </CardDescription>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">
              {dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className={`${getStatusColor(selectedStatus)} px-2 py-0.5 text-xs font-medium rounded-full`}>
              {selectedStatus}
            </Badge>
            <Badge variant="secondary" className={`${getPriorityColor(selectedPriority)} px-2 py-0.5 text-xs font-medium rounded-full`}>
              {selectedPriority} Priority
            </Badge>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Select onValueChange={handleStatusChange} value={selectedStatus}>
            <SelectTrigger className="w-full sm:w-[110px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handlePriorityChange} value={selectedPriority}>
            <SelectTrigger className="w-full sm:w-[110px] h-8 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
