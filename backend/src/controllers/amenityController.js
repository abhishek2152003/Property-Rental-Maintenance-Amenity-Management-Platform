const Amenity = require("../models/Amenity");

const createAmenity = async (req, res) => {
    try {
        const amenity = Amenity({
            name: req.body.name,
            propertyId: req.body.propertyId,
            description: req.body.description,
            image: req.file ? req.file.path : null,
        });
        const savedAmenity = await amenity.save();

        res.status(201).json({
            message: "AmenityCreated",
            data: savedAmenity,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getAllAmenity = async (req, res) => {
    try {
        const amenities = await Amenity.find().populate("propertyId", "name address");
        res.status(200).json(amenities);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getAmenityById = async (req, res) => {
    try {
        const amenity = await Amenity.findById(req.params.id);
        res.json(amenity);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const updateAmenity = async (req, res) => {
    try {
        const updatedAmenity = await Amenity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );

        res.json({
            message: "Amenity updated",
            data: updatedAmenity,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const deleteAmenity = async (req, res) => {
    try {
        await Amenity.findByIdAndDelete(req.params.id);

        res.json({
            message: "Amenity deleted"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getPropertyAmenity = async (req,res) =>{
    try {
        const propertyId = req.params.propertyId;
        const propertyAmenity = await Amenity.find({ propertyId: propertyId});
        res.status(200).json(propertyAmenity);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createAmenity,
    getAllAmenity,
    getAmenityById,
    updateAmenity,
    deleteAmenity,
    getPropertyAmenity,
};
