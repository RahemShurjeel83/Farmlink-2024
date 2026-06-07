const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  process.exit(1);
}

const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "30d" });
};

module.exports = generateToken;
