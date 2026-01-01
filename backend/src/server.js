import express from "express"
import dotenv from "dotenv"

const app = express();
dotenv.config()


const port = process.env.PORT || 5001
app.listen(5001,()=>{
    console.log(`Server is running on port: ${port}`)
})