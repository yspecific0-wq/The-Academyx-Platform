import axios from "axios";

const api = axios.create({
  // Remove the quotes so it reads the actual variable
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
    (config) => {
        // Double-check your Login.jsx to ensure it saves as "ACCESS_TOKEN"
        const token = localStorage.getItem("ACCESS_TOKEN");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add a response interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If token is invalid, clear storage and kick to login
            localStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;