import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  } else {

    return console.log('Token not found in local storage.');
}
  return config;
});

export default instance;
