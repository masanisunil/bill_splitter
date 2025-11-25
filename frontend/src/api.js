import axios from "axios";

const API = axios.create({
  baseURL: "https://bill-splitter-backend-dsj9.onrender.com/api/",

});

export default API;
