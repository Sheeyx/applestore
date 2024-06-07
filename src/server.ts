import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose
.set('strictQuery', false)
.connect(process.env.MONGO_URL as string, {})
.then(()=>{
    console.log("MongoDB connnection succeed");
    const PORT = process.env.PORT ?? 3003;

})
.catch(err => console.log("ERROR on connenction MongoDB",err));