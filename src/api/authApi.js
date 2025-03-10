import axios from "axios";

export const signup = async (name, email, password) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, { name, email, password });
};

export const login = async (email, password) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, { email, password });
};

export const resetPass = async (email, oldPassword, newPassword) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`, { email, oldPassword, newPassword });
}



