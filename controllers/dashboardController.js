const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Exam = require("../models/Exam");
const Timetable = require("../models/Timetable");
const Transaction = require("../models/Transaction");
const Class = require("../models/Class");
const Event = require("../models/Event");

// 🎯 Teacher Dashboard
exports.getTeacherDashboard = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debugging line

    const teacher = await Teacher.findOne({ teacherId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const students = await Student.find({
      class: { $in: teacher.classesAssigned },
    });
    const timetable = await Timetable.find({ teacher: teacher._id });
    const exams = await Exam.find({ class: { $in: teacher.classesAssigned } });
    const assignedClass= await Class.findOne({classTeacher:teacher._id})

    res.json({
      totalStudents: students.length,
      timetable,
      exams,
      assignedClass
    });
  } catch (error) {
    console.error("Error in Teacher Dashboard:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 🎯 Student Dashboard
exports.getStudentDashboard = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debugging line

    const student = await Student.findOne({ email: req.user.email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const attendance = await Attendance.find({ student: student._id });
    const exams = await Exam.find({ class: student.classId });
    const timetable = await Timetable.find({ class: student.className });

    res.json({
      student,
      attendance,
      exams,
      timetable,
    });
  } catch (error) {
    console.error("Error in Student Dashboard:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 🎯 Accountant Dashboard
exports.getAccountantDashboard = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debugging line

    const accountant = await User.findOne({
      email: req.user.email,
      role: "Accountant",
    });
    if (!accountant)
      return res.status(404).json({ error: "Accountant not found" });

    const transactions = await Transaction.find();
    const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    res.json({
      accountant,
      totalTransactions: transactions.length,
      totalRevenue,
      transactions,
    });
  } catch (error) {
    console.error("Error in Accountant Dashboard:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 🎯 Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    // Assuming the domain is passed as a query parameter in the GET request
    const domainName = req.query.domain;
    if (!domainName) {
      return res.status(400).json({ error: "Domain is required" });
    }

    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalClasses,
    ] = await Promise.all([
      User.countDocuments({ domainName }),
      Teacher.countDocuments({ domainName }),
      Student.countDocuments({ domainName }),
      Class.countDocuments({ domainName }),
    ]);

    res.json({
      totals: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalClasses,
      },
    });

  } catch (error) {
    console.error("Dashboard Error 💥", error);
    res.status(500).json({ error: "Server Error" });
  }
};


exports.getEventsDomainRole = async (req, res) => {
  try {
    const { domainName, role } = req.query;

    if (!domainName || !role) {
      return res.status(400).json({ error: "Domain and role are required" });
    }

    const events = await Event.find({ domainName, visibility: { $in: [role, "All"] } });

    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server Error" });
  }
};