import api from './axiosInstance';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const loginUser = async (credentials) => {
  const { data } = await axios.post(`${BASE_URL}/token/`, credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axios.post(`${BASE_URL}/register/`, userData);
  return data;
};

export const refreshToken = async (refresh) => {
  const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
  return data;
};
