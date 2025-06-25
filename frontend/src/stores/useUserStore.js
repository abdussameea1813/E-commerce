import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    accessToken: null,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            set({ loading: false });
            return;
        }

        try {
            const res = await axios.post("/auth/signup", {name, email, password});
            set({ user: res.data , accessToken: res.data.accessToken, loading: false });
            toast.success("Sign up successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign up failed");
            set({ loading: false });
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post('/auth/login', { email, password });
            set({ user: res.data, accessToken: res.data.accessToken, loading: false });
            toast.success("Login successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null });
            toast.success("Logout successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });

        try {
            const res = await axios.get('/auth/profile');
            set({ user: res.data, checkingAuth: false });
        } catch (error) {
            set({ user: null, checkingAuth: false });
        }
    },
}));

// let refreshPromise = null;

// axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 if (refreshPromise) {
//                     await refreshPromise;
//                     return axios(originalRequest);
//                 }

//                 refreshPromise = useUserStore.getState().refreshToken();
//                 await refreshPromise;
//                 refreshPromise = null;

//                 return axios(originalRequest);
//             } catch (refreshError) {
//                 useUserStore.getState().logout();
//                 return Promise.reject(refreshError);
//             }
//         }
//     }
// );

