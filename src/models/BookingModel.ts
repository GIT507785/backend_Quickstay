import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    totalGuests: {
      type: Number,
      default: 1,
    },

    // ⭐ IMPORTANT: Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // ⭐ Price / revenue tracking
    totalAmount: {
      type: Number,
      required: true,
    },

    // ⭐ Payment status (optional but very useful)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // ⭐ Optional: admin notes
    adminNote: {
      type: String,
    },
  },
  { timestamps: true } // ⭐ createdAt + updatedAt
);

const BookingModel = mongoose.model("Booking", BookingSchema);

export default BookingModel;