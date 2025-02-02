'use client'
import React, { useEffect } from 'react'
import { Form, useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const page = () => {
  const [userName, setUserName] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUserName, setIsCheckingUserName] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounce = useDebounceCallback(setUserName, 300)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
      })
      console.log("result", result)
      if (result?.error) {
        toast({
          title: "Login failed",
          description: " Incorrect password or username",
          variant: "destructive"
        })
      }

      if (result?.url) {
        router.replace('/dashboard')
      }
    } catch (error) {

    }
    setIsSubmitting(false)
  }

  return (
    <div className='flex  justify-center items-center min-h-screen bg-gray-100'>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg space-y-8 shadow-md'>

        <div className='text-center'>
          <h3 className='text-4xl font-extrabold  tracking-tight lg:text-4xl mb-6'> Join Mystery Message</h3>
          <p className='mb-4'> Sign In start your anonymous adventure</p>
        </div>
        <div>
          <FormProvider {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} >

              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email/username"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='mt-2'>{
                isSubmitting ? (<>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'> Please wait</Loader2>
                </>) : ('Sign-in')
              }</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default page
