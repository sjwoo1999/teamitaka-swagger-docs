import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api-jcewvyygoq-uc.a.run.app';

export const getCsrfToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
        return response.data.csrfToken;
    } catch (error) {
        console.error('CSRF 토큰 요청 실패:', error);
        throw error;
    }
};

export const login = async (idToken, csrfToken) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/login`,
            { idToken }, // 백엔드가 idToken을 기대하도록 수정
            {
                headers: { 'X-CSRF-Token': csrfToken },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('로그인 요청 실패:', error);
        throw error;
    }
};