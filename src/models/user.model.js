import mongoose from "mongoose";


const profilePictureSchema=[
  "","","","","","",""
]

const userSchema=new mongoose.Schema(
  {
   email:{
    type:String,
    required:[true,'Email is required'],

   },
   password:{
    type:String,
    required:[true,'Password is required']
   },
   name:{
    type:String,
    default:''
   }
   ,
   profilePicture:{
    type:String,
    enum:{
      values:profilePictureSchema,
    },
    default:""
  }

  },{timestamps:true})


  userSchema.index({email:1},{unique:true})

export const User=mongoose.model('User',userSchema)