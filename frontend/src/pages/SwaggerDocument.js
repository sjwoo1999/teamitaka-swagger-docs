import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const SwaggerDocument = () => {
    const token = localStorage.getItem('token');

    return (
        <SwaggerUI
            url={`${API_URL}/api-docs/swagger.json`}
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