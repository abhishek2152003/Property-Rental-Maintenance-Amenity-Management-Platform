const express = require("express");
const router = express.Router();
const { getOwnerDashboardData, getTenantDashboardData } = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");

// owner routes
router.get("/owner/:ownerId", verifyToken, getOwnerDashboardData);

// tenant routes
router.get("/tenant/:tenantId", verifyToken, getTenantDashboardData);

module.exports = router;
