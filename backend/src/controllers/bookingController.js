const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
    try {
        const { amenityId, userId, propertyId, bookingDate, checkInTime, checkOutTime, status } = req.body;

        const existingBooking = await Booking.findOne({
            amenityId,
            bookingDate,
            $or: [
                {
                    checkInTime: { $lt: checkOutTime },
                    checkOutTime: { $gt: checkInTime }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "Time slot already booked"
            });
        }

        const booking = new Booking({
            amenityId,
            userId,
            propertyId,
            bookingDate,
            checkInTime,
            checkOutTime,
            status
        });

        const savedBooking = await booking.save();

        res.status(201).json({
            message: "Amenity booked successfully",
            data: savedBooking
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingById = await Booking.findById(req.params.id);
        if (!bookingById) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(bookingById);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


const getBooking = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("amenityId", "name")
            .populate("userId", "username email role");
        res.json(bookings);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getUserBooking = async (req, res) => {
    try {
        const {userId} = req.params
        const getUserBooking = await Booking.find({userId});
        res.json(getUserBooking);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getAmenityBooking = async (req, res) => {
    try {
        const {amenityId} = req.params
        const getAmenityBooking = await Booking.find({amenityId})
            .populate("amenityId", "name")
            .populate("userId", "username email role");
       
        res.json(getAmenityBooking);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const getPropertyBooking = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const bookings = await Booking.find({ propertyId })
            .populate("amenityId", "name")
            .populate("userId", "username email role");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingById = await Booking.findByIdAndDelete(req.params.id);

        res.status(201).json({
            message: "Booking Deleted",
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { amenityId, bookingDate, checkInTime, checkOutTime, status } = req.body;

        // Check availability (excluding current booking)
        const existingBooking = await Booking.findOne({
            _id: { $ne: id },
            amenityId,
            bookingDate,
            $or: [
                {
                    checkInTime: { $lt: checkOutTime },
                    checkOutTime: { $gt: checkInTime }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "Time slot already booked"
            });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { amenityId, bookingDate, checkInTime, checkOutTime, status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            message: "Booking updated successfully",
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports = {
    createBooking, getBookingById, getBooking, deleteBooking,getUserBooking,getAmenityBooking, getPropertyBooking, updateBooking
}