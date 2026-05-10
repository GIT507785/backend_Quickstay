import mongoose from "mongoose";


const roomsSChema = new mongoose.Schema({
    image:{
        type:String,
         required:true,         
    },
     roomType:{
        type:String,
        required:true,
     },
     price:{
        type:Number,
        required:true
     },
        amenities:{
            type:Object,
                required:true
        },
        isAvailable:{
            type:Boolean,
             default:true
        } ,
        priceOff:{
         type:Number,
          required:false    
        },
        
           
})

const RoomsModel = mongoose.models.Rooms || mongoose.model("Rooms" , roomsSChema)

export default RoomsModel