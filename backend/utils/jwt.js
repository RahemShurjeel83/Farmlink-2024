const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  process.exit(1);
}

module.exports = {
  verifyUnEncrypted(token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
  },
};
