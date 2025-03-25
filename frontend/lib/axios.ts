import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(config => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response?.status === 401) {
//             Cookies.remove('auth_token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default api;