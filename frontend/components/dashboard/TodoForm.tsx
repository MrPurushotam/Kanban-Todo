import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosAtom } from '@/states/atoms';
import { api } from '@/lib/api';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface TodoForm {
  workspaceId: string;
  onClose: () => void;
}

const TodoForm = ({ workspaceId, onClose }: TodoForm) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const setTodos = useSetRecoilState(todosAtom);
  const { toast } = useToast();
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedDueDate = dueDate ? new Date(dueDate) : null;
    try {
      const response = await api.post(`/todo/${workspaceId}`, {
        title,
        description,
        status,
        priority,
        dueDate: parsedDueDate
      });
      if (response.data.success) {
        setTodos((prevTodos) => [...prevTodos, response.data.todo]);
        toast({
          variant: "default",
          title: "Success",
          description: "Created todo."
        });
        onClose();
      } else {
        console.log(response.data.error)
        toast({
          variant: "default",
          description: "Could not create todo. " + response.data.error
      });
      }
    } catch (error: any) {
      console.error('Error creating todo:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
    });
    }
  };

  return (
    // @ts-ignore
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
        {/* @ts-ignore */}
        <Select id="status" value={status} onValueChange={setStatus}>
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
        <RadioGroup id="priority" value={priority} onValueChange={setPriority}>
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
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default TodoForm;