import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
});

axiosClient.interceptors.request.use((request) => {
  console.log('Request:', request);
  return request;
});

axiosClient.interceptors.response.use((response) => {
  console.log('Response:', response);
  return response;
});

export default axiosClient;
