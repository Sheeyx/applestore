import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from './app';

mongoose
.set('strictQuery', false)
.connect(process.env.MONGO_URL as string, {})
.then((data)=>{
    console.log("MongoDB connnection succeed");
    const PORT = process.env.PORT ?? 9001;
    app.listen(PORT, function(){
        console.info(`The server is running successfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    })
})
.catch(err => console.log("ERROR on connenction MongoDB",err));