import express from "express"
import dotenv from "dotenv"

const app = express();
dotenv.config()

console.log("Hello world")
console.log("Hello this for testing purpose only kindly ignore")
const port = process.env.PORT || 5001
app.listen(5001,()=>{
    console.log(`Server is running on port: ${port}`)
})