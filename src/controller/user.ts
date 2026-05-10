import validator from "validator";
import { Request, Response } from "express";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middleware/authUser";
import RoomsModel from "../models/room";
import BookingModel from "../models/BookingModel";
 
export const registerUser = async (req:Request, res:Response) => {

  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      res.json({ mesage: "Please fill all the fields" });
    }

    if (password.length < 8) {
      res.json({ message: "Password must be at least 8 characters long" });
    }

    if (!email.includes("@")) {
      res.json({ message: "Please enter a valid email" });
    }

    if (!validator.isEmail(email)) {
      res.json({ message: "Please enter a valid email" });
    }

    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      res.json({ message: "User already exists with this email" });
    }

      const salt =  await bcrypt.genSalt(10)
       const hashedPassword = await  bcrypt.hash(password , salt)

    const user = await UserModel.create({ name, email, password: hashedPassword });
   
     const token = jwt.sign({id : user._id }, process.env.JWT_SECRET  as string , {expiresIn: "7d"})
     

    res.json({ success: true, message: "User registered successfully", user , token });


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};


// login user 

export const LoginUser = async ( req : Request , res:Response) => {
try {
  
   const {email , password} = req.body 

   if(!email || !password){
    res.json({message:"Please fill all the fields"})
   }

    const user = await UserModel.findOne({email})
    if(!user){
        return res.json({message:"User not found with this email"})
    }

    const matchpassword = await bcrypt.compare(password , user.password)

     if(!matchpassword) {
      return res.json({message:"Invalid email or password"})
     }

    const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
);  

        return res.json({success:true , message:"Login successful", token})

} catch (error) {
  res.json({success:false , message:"Something went wrong"})
}
}

  
// fetch user profile

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No userId",
      });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// pai for update profile
export const updateUserProfile = async (req: any, res:Response) => {
  try {
     
     const userId = req.user?.id
     const {name , email , passowrd} = req.body
       
      const updateUser = await UserModel.findOneAndUpdate({_id:userId} , {name, email , passowrd} , {new:true}).select("-password"  )
      
      if(!updateUser){
        return res.json({success:false , message:"User not found"})
      }
       
      return res.json({succes:true , message:"Profile updated successfully" , user:updateUser})
      
  } catch (error) {
     res.json({success:false , message:"Something went wrong.Try again later"})    
  }
}


export const getAllRoomsUser = async (req:Request , res:Response)=>{
   try {
      const rooms = await RoomsModel.find({})
      res.json({success:true , rooms})
   } catch (error) {
      res.json({success:false , message:"Error occurred while fetching rooms"})
   }
   
}


// get single room details api 
export const getRoomsDetailUser = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params

    const room = await RoomsModel.findById(roomId)

    if (!room) {
      return res.json({
        success: false,
        message: "Room not found"
      })
    }

    return res.json({
      success: true,
      room
    })

  } catch (error: any) {
    console.log(error) // 🔥 real error dekho

    return res.json({
      success: false,
      message: error.message || "Error occurred while fetching room details"
    })
  }
}



// Booking api

 export const getBookingsUser = async (req:any, res:Response) =>{
  try {
    
     const {userName , checkIn , checkOut , totalGuests , roomId} = req.body

       // check the room exists or not 
       const existing = await BookingModel.findOne({
        roomId,
        $or:[
          {
            checkIn: {$lt: new Date(checkOut)},
            checkOut:{$lte:new Date(checkIn)}
          }
        ]
       })
       
        if(existing){
          return res.json({success:false , message: "Room already booked!"})
        }

      const booking = await BookingModel.create({
        userName,
        userId:req.userId,
        checkIn,
        checkOut,
       totalGuests,
        roomId 
      }) 

       return res.json({success:true, booking})

  } catch (error:any) {
    res.json({success:false , message:error.message})
  }
 } 

 // get user bookings 
 export const getAllBookings = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    console.log("USER ID:", userId);

    const bookings = await BookingModel.find({ userId })
      .populate("roomId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      bookings,
    });

  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

 
