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




const page = () => {
  const [userName, setUserName] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUserName, setIsCheckingUserName] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounce = useDebounceCallback(setUserName, 300)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUserName = async () => {
      if (userName) {
        setIsCheckingUserName(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${userName}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;

          setUsernameMessage(axiosError.response?.data.message || "error checking username")
        } finally {
          setIsCheckingUserName(false)
        }
      }
    }
    checkUserName()
  }, [userName])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data)
      toast({
        title: 'Success',
        description: response.data.message,
      })
      router.replace(`/verify/${userName}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      console.error("error in sign up", errorMessage)
      toast({
        title: 'Error in sign up',
        description: errorMessage,
        variant: 'destructive'
      })
    }
    setIsSubmitting(false)
  }

  return (
    <div className='flex  justify-center items-center min-h-screen bg-gray-100'>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg space-y-8 shadow-md'>

        <div className='text-center'>
          <h3 className='text-4xl font-extrabold  tracking-tight lg:text-4xl mb-6'> Join Mystery Message</h3>
          <p className='mb-4'> Sign up start your anonymous adventure</p>
        </div>
        <div>
          <FormProvider {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounce(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isCheckingUserName && <Loader2 className='animate-spin' />}
                    <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'} `}> {usernameMessage}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email"
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
                </>) : ('Sign-up')
              }</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default page
