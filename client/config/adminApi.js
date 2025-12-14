import axios from "axios";

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL 
});

// 1. Request Interceptor (You already have this)
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 👇 2. NEW: Response Interceptor (Handles Expiration)
adminApi.interceptors.response.use(
    (response) => {
        // If the request succeeds, just return the data
        return response;
    },
    (error) => {
        // Check if the error is a 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.log("Session expired. Logging out...");

            // A. Delete the expired token
            localStorage.removeItem("adminToken");

            // B. Redirect to login page
            // We use window.location to force a full page reload and clear Redux states
            window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

export default adminApi;