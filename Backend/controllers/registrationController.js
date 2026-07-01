const Registration = require("../models/Registration");
const Event = require("../models/Event");

const registerEvent = async (req, res) => {
  try {
    // Check request body
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const user = req.user.id;
    const { event } = req.body;

    // Check required fields

    if (!event) {
      return res.status(400).json({
        message: "Event is required",
      });
    }

    // Check Event
    const eventData = await Event.findById(event);

    if (!eventData) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    // Duplicate Check
    const existing = await Registration.findOne({
      user,
      event,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already Registered",
      });
    }

  // Check Event Capacity
    const totalRegistrations = await Registration.countDocuments({
      event,
    });

    if (totalRegistrations >= eventData.capacity) {
      return res.status(400).json({
        message: "Event is Full",
      });
    }

    

    // Save Registration
    const registration = await Registration.create({
      user,
      event,
    });

    res.status(201).json({
      message: "Registration Successful",
      registration,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id
    })
      .populate("user", "-password")
      .populate("event");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Cancel Registration
const cancelRegistration = async (req, res) => {
  try {

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found"
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Registration Cancelled Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  registerEvent,
  getUserRegistrations,
  cancelRegistration
};
