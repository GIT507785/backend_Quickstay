import mongoose from "mongoose";
import "dotenv/config";


const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        if(!process.env.MONGODB_URI){
            throw new Error("MONGODB_URI is not defined in environment variables")
        }
         console.log("MongoDB connected succesfully")
          
    } catch (error) {
        console.error("Error connecting to MongoDB:" , error )
        console.log("Failed to connect to MongoDB. Please check your connection settings.")
        process.exit(1)
    }
}

export default connectDB