import { z } from "zod"

export const newTodoSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Completed"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.union([
        z.string().refine(
            (dateStr) => !isNaN(Date.parse(dateStr)),
            { message: "Invalid date format" }
        ),
        z.date(),
        z.null() 
    ]).refine(
        (date) => date === null || (typeof date === 'string' ? !isNaN(Date.parse(date)) : !isNaN(date.getTime())),
        { message: "Invalid date or string format" }
    )
});

export const updateTodoSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").optional(),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Completed"]).optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    dueDate: z.union([
        z.string().refine(
            (dateStr) => !isNaN(Date.parse(dateStr)),
            { message: "Invalid date format" }
        ),
        z.date(),
        z.null()
    ]).refine(
        (date) => date === null || (typeof date === 'string' ? !isNaN(Date.parse(date)) : !isNaN(date.getTime())),
        { message: "Invalid date or string format" }
    ).optional()
});