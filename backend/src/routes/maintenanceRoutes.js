const express = require("express");
const { createRequest, getAllRequest, updateStatus,getRequestById,getProperty,getUserRequest,updateRequest,deleteRequest}= require("../controllers/maintenanceController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",createRequest);
router.get("/", verifyToken, getAllRequest);
router.get("/:id",getRequestById);
router.get("/property/:propertyId",getProperty)
router.get("/user/:userId",getUserRequest)
router.patch("/:id/status", verifyToken, updateStatus);
router.put("/:id", verifyToken, updateRequest);    
router.delete("/:id", verifyToken, deleteRequest);


module.exports = router;