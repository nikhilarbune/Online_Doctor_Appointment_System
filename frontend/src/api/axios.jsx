import axios from "axios";

const api = axios.create({
  baseURL: "https://online-doctor-appointment-system-2go1.onrender.com",
});

export default api;
