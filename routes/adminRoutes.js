const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");

// Get all events
router.get("/events", adminController.getAllEvents);

// Approve or reject event
router.put("/events/:eventId/status", adminController.updateEventStatus);

// Get all users
router.get("/users", adminController.getAllUsers);

//delete user
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;
