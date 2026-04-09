const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createProperty, getPropertyById, getAllProperty, updateProperty, deleteProperty, getOwnerProperty,addTenantToProperty } = require("../controllers/propertyController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


// Use upload.single("image") middleware
router.post("/", upload.single("image"), createProperty);
router.get("/", getAllProperty);
router.get("/:id", getPropertyById);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty)
router.get("/owner/:ownerId", verifyToken, getOwnerProperty);
router.post("/:propertyId/add-tenant", verifyToken, authorizeRoles, addTenantToProperty);

module.exports = router;