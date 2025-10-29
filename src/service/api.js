import { cerrarSesion, jwtExpirado } from '@/service/authService';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const isRutaLibre = config.url.includes('/login') || config.url.includes('/api/password');

    if (!isRutaLibre) {
        const token = localStorage.getItem('token');
        if (jwtExpirado(token)) {
            cerrarSesion();
            return Promise.reject(new Error('Token expirado'));
        }
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            cerrarSesion();
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            router.push('/login');
        }
        return Promise.reject(err);
    }
);

export default api;
