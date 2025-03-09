import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './SwaggerDocument.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const SwaggerDocument = () => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // API 가용성 체크
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const response = await fetch(`${API_URL}/api-docs/swagger.json`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `서버 응답 오류: ${response.status}`);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };
    checkApiAvailability();
  }, [token]);

  // 오류 시 UI 표시
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>API 문서 로드 실패</h2>
        <p>{error}</p>
        <p>잠시 후 다시 시도하거나 관리자에게 문의하세요.</p>
      </div>
    );
  }

  // Swagger UI 렌더링
  return (
    <SwaggerUI
      url={`${API_URL}/api-docs/swagger.json`}
      requestInterceptor={(req) => {
        if (token) {
          req.headers['Authorization'] = `Bearer ${token}`;
        }
        return req;
      }}
      onComplete={() => setError(null)}
      onFailure={(err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setError(`서버 오류: ${err.response.data.error}`);
        } else {
          setError('Swagger UI 렌더링에 실패했습니다.');
        }
      }}
    />
  );
};

export default SwaggerDocument;