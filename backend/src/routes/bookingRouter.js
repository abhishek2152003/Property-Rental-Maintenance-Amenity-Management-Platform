const express = require("express");
const { createBooking, getBookingById, getBooking, deleteBooking,getUserBooking,getAmenityBooking, getPropertyBooking, updateBooking } = require("../controllers/bookingController");
const router = express.Router();

router.post("/",createBooking);
router.get("/",getBooking);
router.get("/:id",getBookingById);
router.get("/user/:userId",getUserBooking);
router.get("/amenity/:amenityId",getAmenityBooking);
router.get("/property/:propertyId", getPropertyBooking);
router.put("/:id", updateBooking);
router.delete("/:id",deleteBooking)

module.exports = router;