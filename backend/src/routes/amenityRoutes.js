const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createAmenity,getAllAmenity,getAmenityById,updateAmenity,deleteAmenity,getPropertyAmenity } = require("../controllers/amenityController");


// Basic storage config
const upload = multer({ dest: "uploads/amenities/" });

// Add the middleware here: .single("image") matches your React 'name'
router.post("/", upload.single("image"), createAmenity);

router.get("/",getAllAmenity);
router.get("/:id",getAmenityById);
router.put("/:id", upload.single("image"), updateAmenity);
router.delete("/:id",deleteAmenity)

router.get("/:propertyId/amenities",getPropertyAmenity);


module.exports = router;