import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerDocument = () => {
  const token = localStorage.getItem('token');
  return (
    <SwaggerUI
      url="http://localhost:3001/api-docs/swagger.json" // Swagger JSON 경로
      requestInterceptor={(req) => {
        if (token) {
          req.headers['Authorization'] = `Bearer ${token}`;
        }
        return req;
      }}
    />
  );
};

export default SwaggerDocument;