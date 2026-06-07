const Vendor = require("../Models/vendorModel");
const asynchandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const { ROLES } = require("../utils/roles");

const Register = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  try {
    const vendor = await Vendor.create({ username, email, password });
    const token = generateToken({ id: vendor.id, role: ROLES.vendor, username: vendor.username });
    res.status(201).json({ success: true, token });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === "username") {
        return res.status(400).json({ success: false, message: "Username already taken." });
      }
      if (field === "email") {
        return res.status(400).json({ success: false, message: "Email already registered." });
      }
    }
    throw error;
  }
});

const Login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const vendor = await Vendor.findOne({ email });
  if (vendor && (await vendor.matchPassword(password))) {
    const token = generateToken({ id: vendor.id, role: ROLES.vendor, username: vendor.username });
    res.json({ success: true, token, username: vendor.username });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password." });
  }
});

module.exports = { Login, Register };
