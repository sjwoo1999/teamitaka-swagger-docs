import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function ApiDocs() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <div>로그인이 필요합니다.</div>;
  }
  return (
    <SwaggerUI
      url="/api/api-docs/swagger.json"
      requestInterceptor={(req) => {
        req.headers['Authorization'] = `Bearer ${token}`;
        return req;
      }}
    />
  );
}

export default ApiDocs;