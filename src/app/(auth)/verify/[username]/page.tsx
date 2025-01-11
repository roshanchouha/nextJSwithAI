"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast, useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{ username: string }>()


    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })

            toast({
                title: 'Success',
                description: response.data.message,

            })

            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            console.error("error in sign up", errorMessage)
            toast({
                title: 'Sign-up failed',
                description: errorMessage,
                variant: 'destructive'
            })
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 '>
            <div className='w-full max-w-lg p-4 bg-white rounded-lg space-y-8 shadow-md'>
                <div className='text-center'>
                    <h3 className='text-4xl font-extrabold  tracking-tight lg:text-4xl mb-6'> Verify your account </h3>
                    <p className='mb-4'>Enter the verification code sent to your email</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="enter  code" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount