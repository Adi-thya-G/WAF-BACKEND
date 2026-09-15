
import asyncHandler from "#util/asyncHandler.js";
import { loginSchema } from "#types/user.type.js";

export const login=asyncHandler(async(req,res,next)=>{
   
  const {email,password}=req?.body||{}
  const result=loginSchema.safeParse({email,password})
  console.log(result)
  if(!result.success){
    const firstErrorMessage = result.error.message;
    throw new Error(`invalid credentail ${firstErrorMessage}`)

    
  }

   
  res.status(200).json({message:'Login successful'})
})