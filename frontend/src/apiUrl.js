const backedUrl = process.env.REACT_APP_API_URL || "http://localhost:1783";

const getImgUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${backedUrl}/Images/${img}`;
};

export { backedUrl, getImgUrl };
