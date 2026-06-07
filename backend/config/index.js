const config = {
  port: process.env.PORT || 1783,
  baseImageUrl: process.env.BASE_IMAGE_URL || `http://localhost:${process.env.PORT || 1783}/Images/`,
};

module.exports = config;