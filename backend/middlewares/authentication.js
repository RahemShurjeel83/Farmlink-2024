const jwtHelper = require("../utils/jwt");

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required.",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const isVerified = jwtHelper.verifyUnEncrypted(token);

    if (!isVerified) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid.",
      });
    }

    req.userId = isVerified.id;
    req.role = isVerified.role;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid.",
    });
  }
};

module.exports = { checkToken };
