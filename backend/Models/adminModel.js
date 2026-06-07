const mongoose = require("mongoose");
const bcrpt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrpt.genSalt(10);
  this.password = await bcrpt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrpt.compare(enteredPassword, this.password);
};
const AdminModel = mongoose.model("admin", adminSchema);

module.exports =  AdminModel;
