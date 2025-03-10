import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("token");
    return { headers: { Authorization: `${token}` } };
};

export const getTasks = async () => {
    return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, await getAuthHeaders());
};

export const createTask = async (title, description) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, { title, description }, await getAuthHeaders());
};

export const updateTask = async (id, title, description) => {
    return axios.put(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`, { title, description }, await getAuthHeaders());
};

export const deleteTask = async (id) => {
    return axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`, await getAuthHeaders());
};
