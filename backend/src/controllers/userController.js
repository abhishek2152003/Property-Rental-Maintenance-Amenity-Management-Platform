const User = require("../models/User");
const Property = require("../models/Property");
const path = require("path");
const fs = require("fs").promises;

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, role, propertyId } = req.body;

        // Find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Handle image upload
        let imageUrl = user.image;
        if (req.file) {
            // Delete old image if exists
            if (user.image) {
                try {
                    // Try to resolve the path explicitly based on standard uploads folder setup
                    const oldImageName = path.basename(user.image);
                    const oldImagePath = path.join(__dirname, "../../uploads", oldImageName);
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.log("Old image not found or already deleted", err.message);
                }
            }
            // Set new image URL
            imageUrl = `uploads/${req.file.filename}`;
        }

        // Update user fields
        const updateData = {
            username: username || user.username,
            email: email || user.email,
            phone: phone || user.phone,
            role: role || user.role,
            image: imageUrl,
        };

        // Only update propertyId if provided
        if (propertyId !== undefined) {
            updateData.propertyId = propertyId || null;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        // We return the raw object so the frontend ProfileEdit gets exactly user matching response.data
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.fetchUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Frontend ProfileEdit expects raw user object (e.g., user.username, user.email)
        res.status(200).json(user);
    } catch (error) {
        console.error("Fetch profile error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user profile",
            error: error.message
        });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .populate("propertyId", "name address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete user image if exists
        if (user.image) {
            try {
                const oldImageName = path.basename(user.image);
                const imagePath = path.join(__dirname, "../../uploads", oldImageName);
                await fs.unlink(imagePath);
            } catch (err) {
                console.log("Image not found or already deleted");
            }
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

// @desc    Get all tenants for owner properties
// @route   GET /api/users/tenants/owner/:ownerId
// @access  Private (Owner)
exports.getTenantsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // Check if owner is requesting their own tenants
        if (req.user.id !== ownerId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // 1. Find all properties owned by this owner
        const properties = await Property.find({ ownerId });
        const propertyIds = properties.map(p => p._id);

        // 2. Find all tenants assigned to these properties
        const tenants = await User.find({
            propertyId: { $in: propertyIds },
            role: "tenant"
        }).select("-password").populate("propertyId", "name address");

        res.status(200).json({
            success: true,
            count: tenants.length,
            tenants
        });
    } catch (error) {
        console.error("Get tenants by owner error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching tenants",
            error: error.message
        });
    }
};

// @desc    Remove tenant from property
// @route   PUT /api/users/tenants/:id/remove
// @access  Private (Owner)
exports.removeTenantFromProperty = async (req, res) => {
    try {
        const { id } = req.params; // tenant id

        const tenant = await User.findById(id);
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        if (!tenant.propertyId) {
            return res.status(400).json({
                success: false,
                message: "Tenant is not assigned to any property"
            });
        }

        // Authorization: Check if the owner owns the property the tenant is assigned to
        const property = await Property.findById(tenant.propertyId);
        if (!property) {
             // Property not found, but we should still allow unlinking if the data is inconsistent
             tenant.propertyId = null;
             await tenant.save();
             return res.status(200).json({ success: true, message: "Tenant unlinked from nonexistent property" });
        }

        if (property.ownerId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to remove this tenant"
            });
        }

        // Unlink
        tenant.propertyId = null;
        await tenant.save();

        res.status(200).json({
            success: true,
            message: "Tenant removed from property successfully"
        });
    } catch (error) {
        console.error("Remove tenant error:", error);
        res.status(500).json({
            success: false,
            message: "Error removing tenant",
            error: error.message
        });
    }
};
