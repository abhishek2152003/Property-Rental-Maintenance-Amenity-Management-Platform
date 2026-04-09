const Property = require("../models/Property");
const User = require("../models/User");
const Amenity = require("../models/Amenity");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

/**
 * Get consolidated dashboard data for an owner.
 * Query params: startDate, endDate (ISO strings)
 */
const getOwnerDashboardData = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate ownerId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID" });
    }

    // 1. Fetch all properties for this owner
    const properties = await Property.find({ ownerId });
    const propertyIds = properties.map(p => p._id);

    if (propertyIds.length === 0) {
      return res.status(200).json({
        stats: {
          totalProperties: 0,
          totalAmenities: 0,
          totalMaintenanceRequests: 0,
          totalBookings: 0
        },
        properties: [],
        recentRequests: [],
        recentBookings: []
      });
    }

    // 2. Prepare Date Filter for stats if provided
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // 3. Aggregate Stats
    const totalAmenities = await Amenity.countDocuments({ propertyId: { $in: propertyIds }, ...dateFilter });
    const totalRequests = await MaintenanceRequest.countDocuments({ propertyId: { $in: propertyIds }, ...dateFilter });
    const totalBookings = await Booking.countDocuments({ propertyId: { $in: propertyIds }, ...dateFilter });

    // 4. Fetch Details for each Property
    const detailedProperties = await Promise.all(properties.map(async (prop) => {
      const tenantCount = await User.countDocuments({ propertyId: prop._id, role: { $regex: /tenant/i } });
      const amenityCount = await Amenity.countDocuments({ propertyId: prop._id });
      const activeRequestCount = await MaintenanceRequest.countDocuments({
        propertyId: prop._id,
        status: { $ne: "Completed" }
      });

      return {
        ...prop.toObject(),
        tenantCount,
        amenityCount,
        activeRequestCount
      };
    }));

    // 5. Fetch Recent Activities (Latest 5)
    const recentRequests = await MaintenanceRequest.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "username email")
      .populate("propertyId", "name");

    const recentBookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "username email")
      .populate("amenityId", "name")
      .populate("propertyId", "name");

    res.status(200).json({
      stats: {
        totalProperties: properties.length,
        totalAmenities,
        totalMaintenanceRequests: totalRequests,
        totalBookings
      },
      properties: detailedProperties,
      recentRequests,
      recentBookings
    });

  } catch (error) {
    console.error("Error in getOwnerDashboardData:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getTenantDashboardData = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ message: "Invalid Tenant ID" });
    }

    // 1. Fetch User and Property
    const user = await User.findById(tenantId).populate("propertyId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prop = user.propertyId;
    const propertyId = prop?._id;

    // 2. Fetch Latest 5 Maintenance Requests for this user
    const recentRequests = await MaintenanceRequest.find({ userId: tenantId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Fetch Latest 5 Bookings for this user
    const recentBookings = await Booking.find({ userId: tenantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("amenityId", "name")
      .populate("propertyId", "name");

    // 4. Fetch Available Amenities in the property
    let availableAmenities = [];
    if (propertyId) {
      availableAmenities = await Amenity.find({ propertyId });
    }

    // 5. Aggregate Stats
    const totalRequests = await MaintenanceRequest.countDocuments({ userId: tenantId });
    const activeRequests = await MaintenanceRequest.countDocuments({ 
      userId: tenantId, 
      status: { $ne: "Completed" } 
    });
    const totalBookings = await Booking.countDocuments({ userId: tenantId });

    res.status(200).json({
      property: prop ? {
        name: prop.name,
        address: prop.address,
        totalUnits: prop.totalUnits
      } : null,
      stats: {
        activeRequests,
        totalRequests,
        totalBookings,
        amenityCount: availableAmenities.length
      },
      recentRequests,
      recentBookings,
      availableAmenities
    });

  } catch (error) {
    console.error("Error in getTenantDashboardData:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getOwnerDashboardData,
  getTenantDashboardData
};
