'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/utils/supabase/server"
import LoginSchema from "@/schemas/LoginSchema"

export default async function login(data: FormData) {
        // Parse and validate data
        const validatedData = LoginSchema.safeParse(Object.fromEntries(data))

        if (!validatedData.success) {
                console.error("Invalid credentials")
                return { success: false, message: "Invalid credentials" }
        }

        // Destructure validated data
        const { email, password } = validatedData.data
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
                console.error(error.message)
                return { success: false, message: error.message }
        }

        // Successful login: revalidate and redirect
        return { success: true, message: "Logged in successfully! Redirecting" }
        //revalidatePath("/")
        //redirect("/dashboard")
}

