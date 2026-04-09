const MaintenanceRequest = require("../models/MaintenanceRequest");

const createRequest = async (req, res) => {
    try {
        const createRequest = new MaintenanceRequest({
            propertyId: req.body.propertyId,
            userId: req.body.userId,
            category:req.body.category,
            priority:req.body.priority,
            issueDescription: req.body.issueDescription
        });
        const savedRequest = await createRequest.save();
        res.status(201).json({
            message: "Maintenance Request created",
            data: savedRequest
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const getAllRequest = async (req, res) => {
    try {
        const getAllRequest = await MaintenanceRequest.find()
        res.status(200).json(getAllRequest);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const getRequestById = async (req, res) => {
    try {
        const id = req.params.id;
        const getRequestById = await MaintenanceRequest.findById(id)
        res.status(200).json(getRequestById);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const getProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const getProperty = await MaintenanceRequest.find({ propertyId });
        res.status(200).json(getProperty);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const getUserRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const getUsers = await MaintenanceRequest.find({ userId })
        res.status(200).json(getUsers);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateStatus = async (req, res) => {
    try {

        const { status } = req.body
        const request = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            {
                status: status,
                resolvedAt: status === "Completed" ? Date.now() : null
            }
        )
        res.json({
            message: "Status Updated",
            data: request
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const updateRequest = async (req, res) => {
    try {

        const id = req.params.id
        const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            message: "Request Updated",
            data: updatedRequest
        });

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const deleteRequest = async (req, res) => {
    try {

        const id = req.params.id
        const request = await MaintenanceRequest.findByIdAndDelete(id)
        res.json({
            message: "Requested Deleted",
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports = {
    createRequest, getAllRequest, updateStatus,getRequestById,getProperty,getUserRequest,updateRequest,deleteRequest
};