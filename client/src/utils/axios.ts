import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
});

axiosClient.interceptors.request.use((request) => {
  return request;
});

axiosClient.interceptors.response.use((response) => {
  return response;
});

export default axiosClient;
