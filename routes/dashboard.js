const express = require("express");
const {
  getTeacherDashboard,
  getStudentDashboard,
  getAccountantDashboard,
  getAdminDashboard,
  getEventsDomainRole,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher Dashboard
router.get("/teacher", authMiddleware, getTeacherDashboard);

// Student Dashboard
router.get("/student", authMiddleware, getStudentDashboard);

// Accountant Dashboard
router.get("/accountant", authMiddleware, getAccountantDashboard);

// Admin Dashboard
router.get("/admin", authMiddleware, getAdminDashboard);
router.get(
  "/events-domain-role",
  authMiddleware,
  getEventsDomainRole
); // Get events based on domain and role

module.exports = router;
