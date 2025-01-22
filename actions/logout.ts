"use server"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function logout() {
        const supabase = await createClient()
        supabase.auth.signOut()
        revalidatePath("/")
        redirect("/")
}
