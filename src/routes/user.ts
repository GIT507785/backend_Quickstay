import  express from "express";
import { getAllRoomsUser, getRoomsDetailUser, getUserProfile, getBookingsUser ,
   LoginUser, registerUser, getAllBookings } from "../controller/user";
import authUser from "../middleware/authUser";



 const userRouter =  express.Router()

   userRouter.post("/register" , registerUser)
   userRouter.post("/login" , LoginUser)
   userRouter.get('/profile' ,authUser , getUserProfile)
   userRouter.get("/get-all-rooms" , getAllRoomsUser)
    userRouter.get("/get-room/:roomId" , getRoomsDetailUser)
    userRouter.post('/book-room' ,getBookingsUser)
    userRouter.get('/allbookings', authUser , getAllBookings)
  


 export default userRouter