import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getCsrfToken = async () => {
    const response = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
    return response.data.csrfToken;
};

export const login = async (username, password, csrfToken) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        {
            headers: { 'X-CSRF-Token': csrfToken },
            withCredentials: true,
        }
    );
    return response.data;
};