const Admin = require("../Models/adminModel");
const asynchandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const { ROLES } = require("../utils/roles");
const VendorModel = require("../Models/vendorModel");
const ProductModel = require("../Models/AdminModel/ProductModel");
const OrderModel = require("../Models/AdminModel/OrderModel");
const mongoose = require("mongoose");

const Register = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const user = await Admin.create({ username, email, password });
    const token = generateToken({ id: user.id, role: ROLES.admin, username: user.username });
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

  const user = await Admin.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken({ id: user.id, role: ROLES.admin, username: user.username });
    res.json({ success: true, token, username: user.username });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password." });
  }
});

const getVendor = asynchandler(async (req, res) => {
  const vendors = await VendorModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "vendor",
        as: "products",
      },
    },
    {
      $project: { password: 0 },
    },
  ]);
  res.status(200).json(vendors);
});

const deleteVendor = asynchandler(async (req, res) => {
  const vendorId = req.params.vendorId;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ success: false, message: "Invalid vendor ID." });
  }

  const deletedVendor = await VendorModel.findByIdAndDelete(vendorId);
  if (!deletedVendor) {
    return res.status(404).json({ success: false, message: "Vendor not found." });
  }

  await ProductModel.deleteMany({ vendor: new mongoose.Types.ObjectId(vendorId) });
  await OrderModel.deleteMany({ vendor: new mongoose.Types.ObjectId(vendorId) });

  res.status(200).json({ success: true, message: "Vendor and their products/orders deleted." });
});

module.exports = { Login, Register, getVendor, deleteVendor };
