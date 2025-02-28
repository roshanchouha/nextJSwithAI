"use client"
import MessageCards from "@/components/MessageCards";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@radix-ui/react-switch";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast()

    const HandleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    }
    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    })

    const { register, watch, setValue } = form;

    const acceptMessage = watch('acceptMessage');

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')

            setValue('acceptMessage', response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: 'Refreshed Message',
                    description: "showing latest message",

                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "failed to fetch messages",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }, [setIsLoading, setMessages])


    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwithChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessage })
            setValue('acceptMessage', !acceptMessage)
            toast({
                title: 'Success',
                description: response.data.message,
                variant: "default"

            })

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "failed to fetch messages",
                variant: "destructive"
            })
        }
    }
    console.log("session=>", session)

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
                <div>
                    <h1 className="text-4xl font-bold text-gray-700">
                        Sign in to view messages
                    </h1>
                </div>
            </div>
        );
    }
    const { username } = session?.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = async () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'Copied',
            description: 'Profile URL copied to clipboard',
            variant: "default"
        })
    }



    return (
        <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4 ">User Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">copy your Unique Link</h2>{''}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr2"
                    />
                    <Button onClick={copyToClipboard} >Copy</Button>
                </div>
            </div>
            <div className="mb-4">
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessage}
                    onCheckedChange={handleSwithChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages : {acceptMessage ? 'ON' : 'OFF'}
                </span>

            </div>
            <Separator />
            <Button
                className="mt-4"
                variant='outline'
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }} >
                {isLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<RefreshCcw className="h-4 w-4" />)}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (messages.map((message, index) => (
                    <MessageCards
                        key={index}
                        message={message}
                        onMessageDelete={HandleDeleteMessage}
                    />
                ))) : (
                    <p>No Message to Display</p>
                )}
            </div>
        </div>
    );
}
