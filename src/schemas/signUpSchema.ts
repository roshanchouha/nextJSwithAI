import {z} from 'zod'
import React from 'react'

export const usernameValidation = z
.string()
.min(2, "Username must be at least 2 characters")
.max(20, " username must be  no  more then 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"username must not contain special  characters")


export const  signUpSchema  = z.object({
    username: usernameValidation,
    email : z.string().email({message: "please enter valid email address"}),
    password : z.string().min(6, "password must be at least 6 characters") 
})
