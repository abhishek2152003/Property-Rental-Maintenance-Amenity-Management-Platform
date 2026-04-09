const express = require("express");
const multer = require("multer");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { updateProfile, fetchUserProfile, getTenantsByOwner, removeTenantFromProperty } = require("../controllers/userController");

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Get User Profile
router.get("/:id", verifyToken, fetchUserProfile);

// Update User Profile
router.put("/:id", verifyToken, upload.single("image"), updateProfile);

//owner access routes
router.get("/owner", verifyToken, (req, res) => {
    res.json({ message: "Welcome owner" })
});

// Owner-only tenant management routes
router.get("/tenants/owner/:ownerId", verifyToken, getTenantsByOwner);
router.put("/tenants/:id/remove", verifyToken, removeTenantFromProperty);

//tenent access routes
router.get("/tenant", (req, res) => {
    res.json({ message: "Welcome tenant" })
});

module.exports = router;