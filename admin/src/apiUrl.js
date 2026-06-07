const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:1783";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
});

export { backendUrl, getAuthHeaders };
