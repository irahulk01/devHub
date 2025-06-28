
import axios from "axios";

const API_BASE = import.meta.env.VITE_API;

export const fetchDeveloperPofile = () => {
  return axios.get(`${API_BASE}/developers`);
};