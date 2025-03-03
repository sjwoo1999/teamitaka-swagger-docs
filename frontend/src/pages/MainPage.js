import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken, login } from '../services/authService';
import './MainPage.css';

function MainPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getCsrfToken()
            .then(token => setCsrfToken(token))
            .catch(() => setMessage('CSRF 토큰을 가져오지 못했습니다.'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password, csrfToken);
            localStorage.setItem('token', data.token);
            setMessage('로그인 성공! Swagger 문서로 이동합니다.');
            setTimeout(() => navigate('/api-docs'), 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || '로그인 실패');
        }
    };

    return (
        <div className="login-container">
            <h1>Teamitaka 로그인</h1>
            <p>Teamitaka의 Swagger 문서에 오신 것을 환영합니다.<br />승인된 사용자만 접근 가능합니다.</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">사용자 이름</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">로그인</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default MainPage;