import express  from "express";
import { AddRoom, adminLogin,  deleteRoom, getAllRooms,
getDashboardData,  toggleRoomAvailability, 
updateBookingstatus} from "../controller/AdminController"
import { upload } from "../middleware/multer";
import { getAllBookings } from "../controller/user";


const Adminrouter = express.Router()

Adminrouter.post("/login",  adminLogin )
Adminrouter.post("/add-room" , upload.single("image") , AddRoom)
Adminrouter.get("/get-all-rooms" , getAllRooms)
Adminrouter.delete('/delete-room/:roomId' ,deleteRoom)
Adminrouter.post('/toggle-availability/:roomId' , toggleRoomAvailability)
Adminrouter.get('/dashboard-data' , getDashboardData)
Adminrouter.get('/all-bookings' , getAllBookings)
Adminrouter.put('/update-booking/:id' , updateBookingstatus)

export default Adminrouter