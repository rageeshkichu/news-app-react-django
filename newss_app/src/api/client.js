import axios from "axios";
import config from "../functions/config";

const api = axios.create({
  baseURL: config.base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
