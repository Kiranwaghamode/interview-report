import app from "./src/app.js";
import dotenv from 'dotenv'
dotenv.config()

import { connectToDb } from "./src/config/database.js";

connectToDb()

console.log("Connecting to database...")



 
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})  