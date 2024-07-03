import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
});

axiosClient.interceptors.request.use((request) => {
  console.log('Starting Request', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
  });
  return request;
});

axiosClient.interceptors.response.use((response) => {
  console.log('Response:', {
    status: response.status,
    headers: response.headers,
    data: response.data,
  });
  return response;
});

export default axiosClient;
