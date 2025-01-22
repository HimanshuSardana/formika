"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function oauth(provider: Provider) {
        try {
                console.log("Trying to log in with provider", provider);
                const supabase = await createClient();
                const { data, error } = await supabase.auth.signInWithOAuth({ provider });

                if (error) {
                        console.error("Error during OAuth sign-in:", error);
                        return { success: false, error };
                }

                console.log("Successfully logged in:", data);
                redirect(data.url)
                return { success: true, data };
        } catch (error) {
                console.error("Unexpected error:", error);
                return { success: false, error: "Unexpected error occurred" };
        }
}

