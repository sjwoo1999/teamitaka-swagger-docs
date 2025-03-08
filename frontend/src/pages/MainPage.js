import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './MainPage.css';

function MainPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 환경 변수에서 API URL 가져오기
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('로그인 시도 중...');

    try {
      // 1. Firebase Authentication으로 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. 백엔드에 idToken 전송
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '백엔드 인증 실패');
      }

      const data = await response.json();
      setMessage(`로그인 성공! 환영합니다, ${data.uid}`);

      // 3. 토큰 저장 및 페이지 이동
      localStorage.setItem('token', idToken); // 클라이언트에서 재사용 가능
      setTimeout(() => navigate('/dashboard'), 1000); // 예: 대시보드로 이동
    } catch (error) {
      setMessage(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>로그인</h1>
        <p>승인된 사용자만 접근 가능합니다.</p>
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
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default MainPage;