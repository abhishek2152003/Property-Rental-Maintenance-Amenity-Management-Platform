const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ["Plumbing", "Electrical", "HVAC", "Appliance", "Other"],
    default: "Other"
  },
  issueDescription: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("MaintenanceRequest", MaintenanceSchema);
