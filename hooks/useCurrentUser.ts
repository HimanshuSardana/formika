import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UseCurrentUserReturn {
        user: User | null
        loading: boolean
        error: string | null
}

export default function useCurrentUser(): UseCurrentUserReturn {
        const [user, setUser] = useState<User | null>(null)
        const [loading, setLoading] = useState<boolean>(true)
        const [error, setError] = useState<string | null>(null)
        const supabase = createClient()

        useEffect(() => {
                const fetchUser = async () => {
                        try {
                                const {
                                        data: { session },
                                        error: fetchError,
                                } = await supabase.auth.getSession()

                                if (fetchError) {
                                        setError(fetchError.message)
                                } else {
                                        setUser(session?.user ?? null)
                                }
                        } catch (err) {
                                setError("An unexpected error occurred.")
                                console.error("Error fetching user:", err)
                        } finally {
                                setLoading(false)
                        }
                }

                fetchUser()
        }, [])

        return { user, loading, error }
}

