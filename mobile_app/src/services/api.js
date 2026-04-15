import axios from "axios";

const API = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.138.51:5000/api",
});

export default API;
