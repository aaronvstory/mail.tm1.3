import axios from 'axios';
import { cryptoService } from './crypto';

const API_BASE = 'https://api.mail.tm';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await cryptoService.getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
    }
    return Promise.reject(error);
  }
);

export const mailAPI = {
  createAccount: (address: string, password: string) =>
    api.post('/accounts', { address, password }),
  getMessages: (page = 1) => 
    api.get(`/messages?page=${page}&limit=100`),
  deleteMessages: (ids: string[]) =>
    api.patch('/messages', { operations: ids.map(id => ({
      operation: 'delete',
      path: `/messages/${id}`
    }))}),
};
