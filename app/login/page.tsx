"use client"
import { Button } from "@/components/ui/button"
import useCurrentUser from "@/hooks/useCurrentUser"
import Link from "next/link"
import { BrandGithub, BrandGoogle } from '@mynaui/icons-react'
import { FloatingLabelInput } from "@/components/floating-label-input"
import LoginSchema from "@/schemas/LoginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "@mynaui/icons-react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Form, FormItem, FormField, FormMessage, FormControl } from "@/components/ui/form"
import { toast } from "sonner"
import login from "@/actions/login"
import { useState, useTransition } from "react"
import oauth from "@/actions/oauth"
import { LoadingButton } from "@/components/ui/loading-button"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
        const [isPending, startTransition] = useTransition()
        // Check if user is already logged in, if so redirect to dashboard
        //const { user, loading } = useCurrentUser()
        //if (loading) {
        //        return <div className='w-screen h-screen flex justify-center items-center'><Loader2 size="70" className='animate-spin text-primary' /></div>; // You can replace this with a more styled loading indicator
        //}
        //
        //if (user) {
        //        redirect("/dashboard")
        //}

        const form = useForm<z.infer<typeof LoginSchema>>({
                defaultValues: {
                        email: "",
                        password: ""
                },
                resolver: zodResolver(LoginSchema)
        })

        async function onSubmit(data: FormData) {
                startTransition(async () => {
                        const result = await login(data)
                        if (result?.success) {
                                toast.success("Logged in successfully! Redirecting")
                                redirect("/dashboard")
                        }
                        else {
                                toast.error(result?.message)
                        }
                })
        }

        return (
                <div className="flex pl-[5%] h-screen">
                        <div className="flex flex-col h flex-1">
                                <div className="backbar mt-10">
                                        <BackBar />
                                </div>

                                <div className="loginForm px-[10%] flex gap-y-5 flex-col xs:w-full md:w-full h-[calc(90vh-128px)] justify-center">
                                        <form action={onSubmit} className="xs:w-full md:w-2/3 flex gap-4 flex-col">
                                                <h3 className="font-black text-4xl">Log in to your account</h3>
                                                <p className="text-muted-foreground font-bold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, illum!</p>
                                                <Form {...form}>
                                                        <FormField control={form.control} name="email" render={({ field }) => (
                                                                <FormItem>
                                                                        <FormControl>
                                                                                <FloatingLabelInput disabled={isPending} {...field} label="Email" />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )} />
                                                        <FormField control={form.control} name="password" render={({ field }) => (
                                                                <FormItem>
                                                                        <FormControl>
                                                                                <FloatingLabelInput disabled={isPending} label="Password" type="password" className="text-sm" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )} />
                                                        <LoadingButton loading={isPending} type="submit" className="font-bold" disabled={isPending}>Log In</LoadingButton>
                                                </Form>
                                        </form>
                                        <hr className="xs:w-full md:w-2/3" />
                                        <div className="buttons xs:w-full md:w-2/3 flex gap-3">
                                                <Button className="xs:w-full md:w-2/3 " variant={"outline"} size={"lg"} onClick={() => oauth("github")}><BrandGithub size={"35"} /> GitHub</Button>
                                                <Button className="xs:w-full md:w-2/3 " variant={"outline"} size="lg"><BrandGoogle size={"35"} /> Google</Button>
                                        </div>
                                        <div className="flex justify-between xs:w-full md:w-2/3 items-center">
                                                <h3>
                                                        Don't have an account?
                                                </h3>
                                                <Button variant={"link"} asChild><Link href="/register">Register</Link></Button>
                                        </div>
                                </div>
                        </div>
                        <div className="bg-primary h-full flex-[2] md:block sm:hidden">
                        </div>
                </div>
        )
}

function BackBar() {
        return (
                <div className="flex">
                        <Button asChild variant={"secondary"} className="font-bold bg-inherit">
                                <Link href="/"><ChevronLeft /> Back</Link>
                        </Button>

                </div>
        )
}
