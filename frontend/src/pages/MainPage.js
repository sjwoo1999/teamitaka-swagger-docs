import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from '../services/authService';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './MainPage.css';

function MainPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // 환경 변수에서 API URL 가져오기
    const API_URL = process.env.REACT_APP_API_URL;

    // CSRF 토큰 가져오기
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${API_URL}/csrf-token`, { method: 'GET' });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('CSRF 토큰 요청 실패:', error);
            }
        };
        fetchCsrfToken();
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // 메시지 초기화
        try {
            // Firebase 인증
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            console.log('Firebase 로그인 성공:', { uid: user.uid, email: user.email });

            // 백엔드 로그인 요청 (CSRF 토큰 포함)
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ idToken }),
                credentials: 'include', // 쿠키 포함
            });

            if (!response.ok) {
                throw new Error(`백엔드 인증 실패: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token || idToken); // 백엔드 JWT 또는 Firebase ID 토큰 저장
            setMessage('로그인 성공! Swagger 문서로 이동합니다.');
            setTimeout(() => navigate('/api-docs'), 1000);
        } catch (error) {
            setMessage(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
            console.error('로그인 에러:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Teamitaka 로그인</h1>
                <p>Teamitaka의 Swagger 문서에 오신 것을 환영합니다.<br />승인된 사용자만 접근 가능합니다.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
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
                                autoComplete="current-password"
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
                    {message && <p className="error-message">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default MainPage;