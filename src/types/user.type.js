import * as z from 'zod';


export const loginSchema=z.object({
  email:z.string().email("required email"),
  password:z.string().min(8,"password should minimum 8 character")
})