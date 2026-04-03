import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, //cookies bhejne ke lye // imp 
});

export default api;