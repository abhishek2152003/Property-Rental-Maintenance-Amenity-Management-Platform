const Property = require("../models/Property");
const User = require("../models/User");
const createProperty = async (req, res) => {
    try {
        const createProperty = new Property({
            name: req.body.name,
            address: req.body.address,
            image: req.file ? req.file.path : null,
            description: req.body.description,
            totalUnits: req.body.totalUnits,
            ownerId: req.body.ownerId
        })
        const savedProperty = await createProperty.save();
        res.status(201).json({
            message: "Property created",
            data: savedProperty
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateProperty = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        res.status(200).json({
            message: "Property Updated",
            data: updatedProperty
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getAllProperty = async (req, res) => {
    try {
        const allProperties = await Property.find()
        res.status(200).json(allProperties);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getPropertyById = async (req, res) => {
    try {
        const id = req.params.id;
        const findById = await Property.findById(id);
        res.status(200).json(findById);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const deleteProperty = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteById = await Property.findByIdAndDelete(id);
        res.status(200).json({ message: "Property Deleted" });

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getOwnerProperty = async (req, res) => {
    try {
        if (req.user.id !== req.params.ownerId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You can only view your own properties" });
        }
        const properties = await Property.find({ ownerId: req.params.ownerId });
        res.json(properties);
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const addTenantToProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { email } = req.body;

        // 1. Validate input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // 2. Check property
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // 3. Authorization (only owner)
        if (property.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 4. Find tenant by email
        const tenant = await User.findOne({ email });
        if (!tenant) {
            return res.status(404).json({ message: "User not found" });
        }

        // 5. Check role
        if (tenant.role !== "tenant") {
            return res.status(400).json({ message: "User is not a tenant" });
        }

        // 6. Check already assigned
        if (tenant.propertyId) {
            return res.status(400).json({
                message: "Tenant already assigned to a property"
            });
        }

        // 7. Assign property
        tenant.propertyId = propertyId;
        await tenant.save();

        res.status(200).json({
            message: "Tenant added successfully",
            tenant
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProperty,
    getPropertyById,
    getAllProperty,
    updateProperty,
    deleteProperty,
    getOwnerProperty,
    addTenantToProperty,
}