const EARTH_RADIUS_KM = 6371;

const toRadians = (deg) => (deg * Math.PI) / 180;

const haversineKm = (from, to) => {
  if (
    typeof from?.lat !== "number" || typeof from?.lng !== "number" ||
    typeof to?.lat !== "number" || typeof to?.lng !== "number"
  ) {
    return null;
  }

  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;

  return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
};

module.exports = { haversineKm };
