"use client"

import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosAtom } from '@/states/atoms';
import { api } from '@/lib/api';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Todo } from '@/types/todo';
import { useToast } from '@/hooks/use-toast'; 

interface EditTodoComponentProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
}

const EditTodoComponent: React.FC<EditTodoComponentProps> = ({ todo, isOpen, onClose }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [status, setStatus] = useState(todo.status);
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
  const setTodos = useSetRecoilState(todosAtom);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields: Partial<Todo> = {};
    if (title !== todo.title) updatedFields.title = title;
    if (description !== todo.description) updatedFields.description = description;
    if (status !== todo.status) updatedFields.status = status;
    if (priority !== todo.priority) updatedFields.priority = priority;
    const originalDueDate = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '';
    if (dueDate !== originalDueDate) {
      updatedFields.dueDate = new Date(dueDate);
    }
    if (Object.keys(updatedFields).length === 0) {
      toast({
        variant:"default",
        description:"No fields updated"
      });
      onClose();
      return;
    }
    try {
      const response = await api.put(`/todo/${todo.id}`, updatedFields);
      if (response.data.success) {
        setTodos((prevTodos) => prevTodos.map(t => t.id === todo.id ? {...response.data.todo} : t));
        toast({
          variant:"default",
          title:"Success",
          description:"Todo updated"
        });
        onClose();
      }
    } catch (error:any) {
      console.error('Error updating todo:', error.message);
      toast({
        variant:"destructive",
        title:"Error",
        description:error.message
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="priority">Priority</Label>
            <RadioGroup value={priority} onValueChange={setPriority}>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="priority-low"
                  className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted"
                >
                  <RadioGroupItem id="priority-low" value="Low" />
                  Low
                </Label>
                <Label
                  htmlFor="priority-medium"
                  className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted"
                >
                  <RadioGroupItem id="priority-medium" value="Medium" />
                  Medium
                </Label>
                <Label
                  htmlFor="priority-high"
                  className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer [&:has(:checked)]:bg-muted"
                >
                  <RadioGroupItem id="priority-high" value="High" />
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoComponent;