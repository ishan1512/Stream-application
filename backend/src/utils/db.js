import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Database connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to database", error)
        process.exit(1);
    }
}