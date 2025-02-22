import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get base URL from environment variables
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// console.log(BASE_URL);

if (!BASE_URL) {
  console.warn("API URL not found in environment variables");
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// console.log(AsyncStorage.getItem("biz-bozz-token"));

// Add a request interceptor to add the token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("biz-bozz-token");
      // console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear the token
        await AsyncStorage.removeItem("biz-bozz-token");

        // You might want to redirect to login here
        // For example, using router.replace('/login')
      } catch (error) {
        console.error("Error handling token expiration:", error);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions to manage the token
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("biz-bozz-token", token);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem("biz-bozz-token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem("biz-bozz-token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export default axiosInstance;
