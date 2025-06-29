import axios from "axios";

const API_BASE = import.meta.env.VITE_API;

export const fetchDeveloperPofile = () => {
  return axios.get(`${API_BASE}/developers`);
};

export const fetchDeveloperByUID = (uid) => {
  return axios.get(`${API_BASE}/developers?uid=${uid}`);
};

export const fetchBlogsByAuthorId = (authorId) => {
  return axios.get(`${API_BASE}/blogs?authorId=${authorId}`);
};