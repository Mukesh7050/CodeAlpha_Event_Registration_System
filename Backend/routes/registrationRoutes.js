// const express = require("express");
// const router = express.Router();

// const {
//   registerEvent,
//   getUserRegistrations
// } = require("../controllers/registrationController");



// router.post("/", registerEvent);
// router.get("/user/:userId", getUserRegistrations);

// module.exports = router;


const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  registerEvent,
  getUserRegistrations,
  cancelRegistration
} = require("../controllers/registrationController");

// Register Event (Protected)
router.post("/", auth, registerEvent);

// Get User Registrations (Protected)
router.get("/my", auth, getUserRegistrations);

router.delete("/:id", auth, cancelRegistration);

module.exports = router;