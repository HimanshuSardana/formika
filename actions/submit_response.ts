"use server"
import { createClient } from "@/utils/supabase/server"

type ResponseData = {
        response: Object
}

export default async function submitResponse(id, data: ResponseData) {
        const supabase = await createClient()

        const { error } = await supabase.from("responses").insert({
                form_id: parseInt(id),
                response: data.response
        })
        if (error) {
                console.error(error.message)
                return { success: false, message: error.message }
        }

        return { success: true, message: "Response submitted successfully" }
}
