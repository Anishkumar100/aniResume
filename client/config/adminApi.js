import axios from "axios";

// Dedicated instance for Admin operations only
const adminApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL 
});

// Interceptor that ONLY checks for 'adminToken'
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken"); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default adminApi;