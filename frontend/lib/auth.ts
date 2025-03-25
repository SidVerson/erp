import api from './axios';
import Cookies from 'js-cookie';

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const logout = () => {
    Cookies.remove('auth_token');
    window.location.href = '/login';
};