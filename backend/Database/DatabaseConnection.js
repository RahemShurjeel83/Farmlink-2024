const mongoose = require("mongoose");

const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("FATAL: MONGODB_URI environment variable is not set. Create a .env file from .env.example.");
  process.exit(1);
}

mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});
const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Mongoose connected`);
});

db.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = db;
