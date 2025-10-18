import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authService = {
  // LOGIN
  async login(credentials) {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.post("/api/login", credentials);
    return res.data;
  },

  // REGISTER
  async register(userData) {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.post("/api/register", userData);
    return res.data;
  },

  // LOGOUT
  async logout() {
    const res = await api.post("/api/logout");
    return res.data;
  },

  // GET USER
  async getUser() {
    const res = await api.get("/api/user");
    return res.data;
  },
};

export default api;
