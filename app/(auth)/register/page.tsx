"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BrandGithub } from '@mynaui/icons-react'
import { FloatingLabelInput } from "@/components/floating-label-input"
import RegistrationSchema from "@/schemas/RegistrationSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Form, FormItem, FormField, FormMessage, FormControl } from "@/components/ui/form"
import { toast } from "sonner"
import register from "@/actions/register"
import login from "@/actions/login"
import { useState, useTransition } from "react"
import { LoadingButton } from "@/components/ui/loading-button"
import { redirect } from "next/navigation"
import useCurrentUser from "@/hooks/useCurrentUser"
import { Loader2 } from "lucide-react"

export default function RegistrationPage() {
        //const { user, loading } = useCurrentUser()
        //if (loading) {
        //        return <div className='w-screen h-screen flex justify-center items-center'><Loader2 size="70" className='animate-spin text-primary' /></div>; // You can replace this with a more styled loading indicator
        //}
        //
        //if (user) {
        //        redirect("/dashboard")
        //}
        const [isPending, startTransition] = useTransition()
        const form = useForm<z.infer<typeof RegistrationSchema>>({
                defaultValues: {
                        email: "",
                        name: "",
                        password: ""
                },
                resolver: zodResolver(RegistrationSchema)
        })

        async function onSubmit(data: FormData) {
                startTransition(async () => {
                        const result = await register(data)
                        if (result?.success) {
                                toast.success("Registration successful")
                                redirect("/login")
                        }
                        else {
                                toast.error(result?.message)
                        }
                })
        }

        return (
                <>
                        <nav className="flex h-32 items-center justify-between px-[10%]">
                                <Button variant={"ghost"} className="font-bold" asChild><Link href="/">Back</Link></Button>
                        </nav>

                        <div className="loginForm px-[10%] flex gap-y-5 flex-col xs:w-full md:w-1/2 h-[calc(90vh-128px)] justify-center">
                                <form action={onSubmit} className="xs:w-full md:w-2/3 flex gap-4 flex-col">
                                        <h3 className="font-black text-4xl">Create a new account</h3>
                                        <p className="text-muted-foreground font-bold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, illum!</p>
                                        <Form {...form}>
                                                <FormField control={form.control} name="name" render={({ field }) => (
                                                        <FormItem>
                                                                <FormControl>
                                                                        <FloatingLabelInput disabled={isPending} {...field} label="Full Name" />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )} />
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
                                                <LoadingButton loading={isPending} type="submit" className="font-bold" disabled={isPending}>Register</LoadingButton>
                                        </Form>
                                </form>
                                <hr className="xs:w-full md:w-2/3" />
                                <div className="flex justify-between xs:w-full md:w-2/3 items-center">
                                        <h3>
                                                Already have an account?
                                        </h3>
                                        <Button variant={"link"} asChild><Link href="/login">Log In</Link></Button>
                                </div>
                        </div >
                </>
        )
}

