import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //Handle common errors globally
        if (error.response) {
            const serverMessage = error.response.data?.message;

            if (error.response.status === 401) {
                //Redirect to login page
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server Error:", error.response.data);
                alert(serverMessage || "A server error occurred. Please try again later.");
            } else if (error.response.status === 503) {
                console.error("Service Unavailable:", error.response.data);
                alert(serverMessage || "The assistant is not configured yet.");
            } else if (error.code === "ECONNABORTED") {
                console.error("Request Timeout:", error.message);
                alert("The request timed out. Please check your internet connection and try again.");
            }
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;