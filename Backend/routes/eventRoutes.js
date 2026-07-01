const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById
} = require("../controllers/eventController");

// Create Event
router.post("/", createEvent);

// Get All Events
router.get("/", getAllEvents);

// Get Single Event
router.get("/:id", getEventById);

module.exports = router;