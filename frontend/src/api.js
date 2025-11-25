import axios from "axios";

const API = axios.create({
  baseURL: 
    process.env.NODE_ENV === "production"
      ? "https://bill-splitter-backend-dsj9.onrender.com/api/"
      : "http://localhost:8000/api/",
});

export default API;
