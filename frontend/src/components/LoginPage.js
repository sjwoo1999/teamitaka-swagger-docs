import React, { useState } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Firebase 설정 (자신의 설정으로 교체)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
};
initializeApp(firebaseConfig);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password });
      const customToken = response.data.token;

      const auth = getAuth();
      const userCredential = await signInWithCustomToken(auth, customToken);
      const idToken = await userCredential.user.getIdToken();
      
      localStorage.setItem('token', idToken);
      navigate('/api-docs');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', color: '#fff' }}>
      <h1 style={{ color: '#ffd700' }}>Teamitaka 로그인</h1>
      <p style={{ color: '#ffd700' }}>승인된 사용자만 Swagger 문서에 접근 가능합니다.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.targetValue)}
        placeholder="사용자 이름 (이메일)"
        style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
      />
      <button
        onClick={handleLogin}
        style={{ background: '#ffd700', color: '#000', padding: '10px', border: 'none', borderRadius: '4px' }}
      >
        로그인
      </button>
    </div>
  );
};

export default LoginPage;