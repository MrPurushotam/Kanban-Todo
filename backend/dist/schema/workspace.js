"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = exports.createWorkspace = void 0;
const zod_1 = require("zod");
exports.createWorkspace = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Workspace name can't be less then 3 letters." }).max(16, { message: "Workspace name can't be greater then 16 letters." }),
});
exports.updateWorkspace = zod_1.z.object({
    id: zod_1.z.string(),
    newName: zod_1.z.string().min(3, { message: "Workspace name can't be less then 3 letters." }).max(16, { message: "Workspace name can't be greater then 16 letters." }),
});
