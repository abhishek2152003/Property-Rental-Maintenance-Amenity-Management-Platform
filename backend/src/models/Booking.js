const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
    amenityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    checkInTime: String,
    checkOutTime: String,
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);