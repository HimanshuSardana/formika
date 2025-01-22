import { z } from "zod"

const RegistrationSchema = z.object({
        email: z.string().email(),
        name: z.string().min(2),
        password: z.string().min(8)
})

export default RegistrationSchema 
