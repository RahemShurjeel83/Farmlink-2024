const User = require("../Models/userModel");
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
    const user = await User.create({ username, email, password });
    const token = generateToken({ id: user.id, role: ROLES.user, username: user.username });
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

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken({ id: user.id, role: ROLES.user, username: user.username });
    res.json({ success: true, token, username: user.username });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password." });
  }
});

module.exports = { Login, Register };
