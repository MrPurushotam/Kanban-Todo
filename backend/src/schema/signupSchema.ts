import {z} from "zod"

export const signupSchema=z.object({
    email:z.string().email(),
    name:z.string().min(6,{message:"Name cannot be less then 6 character."}).max(30),
    username:z.string().min(7,{message:"Username cannot be less then 7 characters."}).max(15),
    password:z.string().min(6).max(16),
})