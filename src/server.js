import express,{Router} from "express"

const router=Router()
const app=express()

router.get("/me",(req,res)=>{
    res.send("Hello from me")
})
app.use(
  "/user",(req,res,next)=>{
    console.log("Middleware for /user route")
    next()
  },router)
app.get("/",(req,res)=>{
    res.send("Hello World")
})
app.get("/about/:id",(req,res)=>{
   const data=req.query
  console.log(data.name)
  res.send(`About page with id: ${req.params.id}`)
})
app.get("/about/:id/sbdhsbdhb",(req,res)=>{
   const data=req.query
  console.log(data.name)
  res.send(`About page with id: ${req.params.id}`)
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

