"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoSchema = exports.newTodoSchema = void 0;
const zod_1 = require("zod");
exports.newTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters long"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["To Do", "In Progress", "Completed"]),
    priority: zod_1.z.enum(["Low", "Medium", "High"]),
    dueDate: zod_1.z.union([
        zod_1.z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), { message: "Invalid date format" }),
        zod_1.z.date(),
        zod_1.z.null()
    ]).refine((date) => date === null || (typeof date === 'string' ? !isNaN(Date.parse(date)) : !isNaN(date.getTime())), { message: "Invalid date or string format" })
});
exports.updateTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters long").optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["To Do", "In Progress", "Completed"]).optional(),
    priority: zod_1.z.enum(["Low", "Medium", "High"]).optional(),
    dueDate: zod_1.z.union([
        zod_1.z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), { message: "Invalid date format" }),
        zod_1.z.date(),
        zod_1.z.null()
    ]).refine((date) => date === null || (typeof date === 'string' ? !isNaN(Date.parse(date)) : !isNaN(date.getTime())), { message: "Invalid date or string format" }).optional()
});
