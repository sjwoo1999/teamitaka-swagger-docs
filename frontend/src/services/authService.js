import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getCsrfToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
        return response.data.csrfToken;
    } catch (error) {
        console.error('CSRF 토큰 요청 실패:', error);
        throw error;
    }
};

export const login = async (email, password, csrfToken) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
            headers: { 'X-CSRF-Token': csrfToken },
            withCredentials: true,
        }
    );
    return response.data;
};