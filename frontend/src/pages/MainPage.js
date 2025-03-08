import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './MainPage.css';

function MainPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://api-jcewvyygoq-uc.a.run.app'; // 실제 백엔드 URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Firebase 인증
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 백엔드 인증 요청
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '백엔드 인증 실패');
      }
      const data = await response.json();
      setMessage(`로그인 성공! 환영합니다, ${data.user}`);

      // 토큰 저장 및 페이지 이동
      localStorage.setItem('token', idToken);
      setTimeout(() => navigate('/api-docs'), 1000);
    } catch (error) {
      setMessage(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button type="submit">로그인</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default MainPage;