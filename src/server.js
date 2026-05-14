import dotenv from 'dotenv';
dotenv.config();
import express, { urlencoded } from 'express';
import connectDB from '#db/dbConnection.js';
import path from "path"
import userRouter from '#routers/user.router.js'
const app=express()


app.use(urlencoded())
app.use(express.json())

app.use("/profile",express.static(path.join(process.cwd(),"src/assest/profile/")))

app.use('/api/v1/user',userRouter)
connectDB().then(()=>{
app.listen(3000,()=>{
  console.log(`http://localhost:3000`)
})
}).catch((err)=>{
  console.error('Error starting server:', err);
})