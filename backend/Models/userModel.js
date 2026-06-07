const mongoose = require("mongoose");
const bcrpt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
  cart:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  cartItems:[],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrpt.genSalt(10);
  this.password = await bcrpt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrpt.compare(enteredPassword, this.password);
};
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
