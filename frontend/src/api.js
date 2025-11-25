import axios from "axios";
const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://bill-splitter-backend-dsj9.onrender.com/api/"
      : "http://127.0.0.1:8000/api/",
});


export default API;
