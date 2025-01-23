"use server"

type ResponseData = {
        response: Object
}

import { createClient } from "@/utils/supabase/server"
export default async function submitResponse(id: string | number, data: ResponseData) {
        const supabase = await createClient()

        const { error } = await supabase.from("responses").insert({
                form_id: parseInt(id.toString()),
                response: data.response
        })
        if (error) {
                console.error(error.message)
                return { success: false, message: error.message }
        }

        return { success: true, message: "Response submitted successfully" }
}

