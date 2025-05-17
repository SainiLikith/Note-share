import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded._id || null;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}