import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/database";
import "dotenv/config"
import userRouter from "./routes/user";
import Adminrouter from "./routes/Admin";
import connectCloudinary from "./middleware/cloudinary";

 
const app: Application = express();
// const server = http.createServer(app);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
 connectDB()
 connectCloudinary() 


app.use("/api/user" , userRouter)
app.use("/api/admin" , Adminrouter) 


const PORT = process.env.PORT || 5000



// Routes
app.listen(PORT , () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
})

export default app;