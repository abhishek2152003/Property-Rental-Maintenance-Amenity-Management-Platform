const mongoose = require("mongoose");
const AmenitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    image: String,
    description: String
}, { timestamps: true });

module.exports = mongoose.model("Amenity", AmenitySchema);