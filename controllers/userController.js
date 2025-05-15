const User = require("../models/User");

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { domain, role } = req.query; // Extract domain and role from request query

    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }

    const query = {
      domainName: domain,
      _id: { $ne: req.user.id }, // Exclude current user
    };

    if (role) {
      query.role = role; // Add role to the query if provided
    }

    const users = await User.find(query).select("-password");

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the specified criteria" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};