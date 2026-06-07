const AsyncHandler = require("express-async-handler");
const ContactUsModel = require("../../Models/AdminModel/ContactUsModel");

const postcontactus = AsyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  await ContactUsModel.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: "Message received. We will get back to you soon." });
});

const getcontactus = AsyncHandler(async (req, res) => {
  const queries = await ContactUsModel.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: queries });
});

const deletecontactus = AsyncHandler(async (req, res) => {
  const queryId = req.params.queryId;

  const deletedQuery = await ContactUsModel.findByIdAndDelete(queryId);
  if (!deletedQuery) {
    return res.status(404).json({ success: false, message: "Query not found." });
  }

  res.status(200).json({ success: true, message: "Query deleted successfully." });
});

module.exports = { postcontactus, getcontactus, deletecontactus };
