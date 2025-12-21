import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const userStore = localStorage.getItem('user-store');
  if (userStore) {
    const { state } = JSON.parse(userStore);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});


export default api;