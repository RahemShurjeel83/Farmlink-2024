const { ROLES } = require("./roles");

const AdminAuth = (req, res, next) => {
  if (req.role === ROLES.admin) return next();
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

const VendorAuth = (req, res, next) => {
  if (req.role === ROLES.vendor) return next();
  return res.status(403).json({
    success: false,
    message: "Access denied. Vendors only.",
  });
};

const BothAuth = (req, res, next) => {
  if (req.role === ROLES.vendor || req.role === ROLES.admin) return next();
  return res.status(403).json({
    success: false,
    message: "Access denied. Vendors and admins only.",
  });
};

const UserAuth = (req, res, next) => {
  if (req.role === ROLES.user) return next();
  return res.status(403).json({
    success: false,
    message: "Access denied. Users only.",
  });
};

module.exports = { AdminAuth, UserAuth, VendorAuth, BothAuth };
