import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken, login } from '../services/authService';
import './MainPage.css';

function MainPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="login-page">
            <div className="login-container">
                <h1>Teamitaka 로그인</h1>
                <p>Teamitaka의 Swagger 문서에 오신 것을 환영합니다.<br />승인된 사용자만 접근 가능합니다.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">사용자 이름</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="사용자 이름을 입력하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '숨기기' : '보기'}
                            </span>
                        </div>
                    </div>
                    <button type="submit">로그인</button>
                    <p className="error-message">{message}</p>
                </form>
            </div>
        </div>
    );
}

export default MainPage;