import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// 환경 변수에서 API URL을 가져옴 (기본값은 개발 환경용)
const API_URL = process.env.API_URL || 'http://localhost:3001';

const SwaggerDocument = () => {
  // localStorage에서 JWT 토큰을 가져옴
  const token = localStorage.getItem('token');

  return (
    <SwaggerUI
      // Swagger JSON 파일의 URL을 환경 변수로 동적으로 설정
      url={`${API_URL}/api-docs/swagger.json`}
      requestInterceptor={(req) => {
        if (token) {
          // JWT 토큰이 있으면 Authorization 헤더에 추가
          req.headers['Authorization'] = `Bearer ${token}`;
        }
        return req;
      }}
    />
  );
};

export default SwaggerDocument;