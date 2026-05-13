import dotenv from 'dotenv';
dotenv.config();
import express, { urlencoded } from 'express';
import connectDB from '#db/dbConnection.js';
const app=express()


app.use(urlencoded())
app.use(express.json())


connectDB().then(()=>{
app.listen(3000,()=>{
  console.log(`http://localhost:3000`)
})
}).catch((err)=>{
  console.error('Error starting server:', err);
})