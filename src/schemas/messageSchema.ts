import {boolean, z} from "zod"

export const messageSchema = z.object({
   content : z.string().min(6, {message: "content must be at least 6 characters"})
   .max(300, {message: "content must be no more than 300 characters"})
})
