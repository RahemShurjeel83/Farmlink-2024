const mongoose = require("mongoose");

const ContactUsSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ContactUsModel = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUsModel;
