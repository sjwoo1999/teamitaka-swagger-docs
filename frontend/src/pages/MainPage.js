import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './MainPage.css';

function MainPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // CSRF 토큰 가져오기
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`CSRF 토큰 요청 실패: 상태 코드 ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('CSRF 토큰 응답이 JSON 형식이 아닙니다.');
        }
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('CSRF 토큰 획득 성공:', data.csrfToken); // 디버깅용
      } catch (error) {
        console.error('CSRF 토큰 가져오기 실패:', error);
        setMessage(`CSRF 토큰을 가져오지 못했습니다: ${error.message}`);
      }
    };
    fetchCsrfToken();
  }, [API_URL]);

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('로그인 시도 중...');

    // CSRF 토큰 확인
    if (!csrfToken) {
      setMessage('CSRF 토큰이 없습니다. 페이지를 새로고침하세요.');
      console.warn('CSRF 토큰 누락으로 요청 중단');
      return;
    }

    try {
      // Firebase 인증
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      console.log('Firebase 인증 성공, idToken:', idToken); // 디버깅용

      // 백엔드 요청
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });

      const contentType = response.headers.get('Content-Type');
      if (!response.ok) {
        let errorMessage = `서버 오류: ${response.status}`;
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || '백엔드 인증 실패';
        } else {
          const errorText = await response.text();
          errorMessage += ` - ${errorText.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('서버 응답이 JSON 형식이 아닙니다.');
      }

      const data = await response.json();
      setMessage(`로그인 성공! 환영합니다, ${data.uid}.`);
      localStorage.setItem('token', idToken);
      console.log('로그인 성공, 사용자 UID:', data.uid); // 디버깅용
      setTimeout(() => navigate('/api-docs'), 1000);
    } catch (error) {
      setMessage(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 처리 중 오류:', error);
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