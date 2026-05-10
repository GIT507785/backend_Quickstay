import { Request , response, Response } from "express";
import RoomsModel from "../models/room"
import {v2 as cloudinary} from "cloudinary";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import BookingModel from "../models/BookingModel"

// admmin login api 
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (  email !== process.env.ADMIN_EMAIL ||  password !== process.env.ADMIN_PASSWORD ) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const atoken = jwt.sign(
      email + password,
      process.env.JWT_SECRET as string,
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token: atoken,
    });
  } catch (error) {
    res.json({ success: false, message: "Error occurred  during admin login" });
  }
};
 

// add room api 
export const AddRoom = async (req: Request, res: Response) => {
  try {
    const { roomType, price, priceOff } = req.body;
    const imageFile = req.file 
    const amenities = JSON.parse(req.body.amenities)

    if (!roomType || !price || !amenities) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const existingRoom = await RoomsModel.findOne({ roomType });

    if (existingRoom) {
      return res.json({
        success: false,
        message: "Room already exists with this room type",
      });
    }

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(imageFile.path);

    const room = await RoomsModel.create({
      roomType,
      price,
      amenities,
      priceOff,
      image: uploadedImage.secure_url,
    });

    return res.json({
      success: true,
      message: "Room added successfully",
      room,
    });

  } catch (error: any) {
    console.error(error);

    return res.json({
      success: false,
      message: error.message || "Error occurred while adding room",
    });
  }
};


// get all rooms api 
export const getAllRooms = async (req:Request , res:Response)=>{
   try {
      const rooms = await RoomsModel.find({})
      res.json({success:true , rooms})
   } catch (error) {
      res.json({success:false , message:"Error occurred while fetching rooms"})
   }
}

// get single room details api 
export const getRoomsDetail = async (req: Request , res:Response) =>{
   try {
      const {roomId} = req.params
       const room = await RoomsModel.findById(roomId)
         if(!room){  
         res.json({success:false , message:"Room not found"})
         }
         res.json({success:true , room})
   } catch (error) {
      res.json({success:false , message:"Error occurred while fetching room details"})
   }
}

// delete room api
export const deleteRoom = async (req:Request , res:Response) =>{
   try {
      const {roomId} = req.params
      const deleteRoom = await RoomsModel.findByIdAndDelete(roomId)
      if(!deleteRoom){
         res.json({success:false , message:"Room not found"})
      }
      res.json({success:true , message:"Room deleted successfully"})
   } catch (error) {
      res.json({success:false , message:"Error occurred while deleting room"})
   }
}

// toggle button availabele or not available api
export const toggleRoomAvailability = async (req:Request , res:Response) =>{
try {
   const {roomId} = req.params 
   console.log(roomId)
   const room = await RoomsModel.findById(roomId)
   if(!room){
      res.json({success:false , message:"Room not found"})
   }
   room.isAvailable = !room.isAvailable
   await room.save()
   res.json({success:true , message:"Room availability toggled successfully" , room})
} catch (error:any) {
   res.json({success:false , message:error})
}
}

// get all dashoard data api 
export const getDashboardData = async (req:Request , res:Response) =>{
   try {
      const totalRooms = await RoomsModel.countDocuments()
      const availableRooms = await RoomsModel.countDocuments({isAvailable:true})
      const unavailableRooms = await RoomsModel.countDocuments({isAvailable:false})
      const totalBookings = await BookingModel.countDocuments()
      res.json({success:true , data:{totalRooms , availableRooms , totalBookings, unavailableRooms}})

   } catch (error:any) {
      res.json({success:false , message:error.message})
   }
}

// get all bookings 
export const getAllBookings = async (req: Request , res:Response) =>{
  try {
    const bookings = await BookingModel.find().populate("roomId").populate("userId")
    return res.json({success:false , bookings})
  } catch (error:any) {
      res.json({success:false , message:error.message})
  }
}

export const updateBookingstatus = async (req:Request , res:Response)=>{
  try {
    const {id} = req.params
    const {status} = req.body

     const validStatus = ["pending" , "confirmed" , "cancelled"]
     if(validStatus.includes(status)){
      res.json({status:false , message:"Invalid status value"})
     } 
     
    
    const booking = await BookingModel.findById(id)
    if(!booking){
      return res.json({success:false , message:"Booking not found"})
    }
     
   booking.status = status
   await booking.save()
    res.json({success:true , message:"Booking status updated successfully" , booking})


  } catch (error:any) {
    res.json({success:false , message:error.message})
  }
}
 
