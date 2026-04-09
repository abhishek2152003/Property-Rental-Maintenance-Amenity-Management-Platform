const express = require("express");
const { createRequest, getAllRequest, updateStatus,getRequestById,getProperty,getUserRequest,updateRequest,deleteRequest}= require("../controllers/maintenanceController");
const router = express.Router();

router.post("/",createRequest);
router.get("/",getAllRequest);
router.get("/:id",getRequestById);
router.get("/property/:propertyId",getProperty)
router.get("/user/:userId",getUserRequest)
router.patch("/:id/status", updateStatus);
router.put("/:id", updateRequest);    
router.delete("/:id", deleteRequest);


module.exports = router;