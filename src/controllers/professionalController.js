const mongoose = require("mongoose");
const Professional = require("../models/Professional");

// Get all professionals
const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find();

    res.status(200).json({
      success: true,
      count: professionals.length,
      professionals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch professionals",
      error: error.message,
    });
  }
};

// Get one professional by ID
const getProfessionalById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional ID",
      });
    }

    const professional = await Professional.findById(req.params.id);

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      professional,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch professional",
      error: error.message,
    });
  }
};

// Create a professional
const createProfessional = async (req, res) => {
  try {
    const {
      name,
      service,
      description,
      location,
      experience,
      rating,
      price,
      availability,
    } = req.body;

    if (
      !name ||
      !service ||
      !description ||
      !location ||
      experience === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, service, description, location, experience, and price are required",
      });
    }

    const professional = await Professional.create({
      user: req.user.userId,
      name,
      service,
      description,
      location,
      experience,
      rating,
      price,
      availability,
    });

    res.status(201).json({
      success: true,
      message: "Professional created successfully",
      professional,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create professional",
      error: error.message,
    });
  }
};

// Update a professional (only the owning professional, or an admin, may update)
const updateProfessional = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional ID",
      });
    }

    const existing = await Professional.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    const isOwner =
      existing.user.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to update this listing",
      });
    }

    const professional =
      await Professional.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Professional updated successfully",
      professional,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update professional",
      error: error.message,
    });
  }
};

// Delete a professional (only the owning professional, or an admin, may delete)
const deleteProfessional = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid professional ID",
      });
    }

    const existing = await Professional.findById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    const isOwner =
      existing.user.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to delete this listing",
      });
    }

    await Professional.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Professional deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete professional",
      error: error.message,
    });
  }
};

module.exports = {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
};