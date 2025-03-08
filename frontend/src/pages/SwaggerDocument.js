import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const SwaggerDocument = () => {
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkApiAvailability = async () => {
            try {
                const response = await fetch(`${API_URL}/api-docs/swagger.json`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!response.ok) {
                    throw new Error(`서버 응답 오류: ${response.status}`);
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };
        checkApiAvailability();
    }, []);

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h2>API 문서 로드 실패</h2>
                <p>{error}</p>
                <p>잠시 후 다시 시도하거나 관리자에게 문의하세요.</p>
            </div>
        );
    }

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
            onFailure={() => setError('Swagger UI 렌더링에 실패했습니다.')}
        />
    );
};

export default SwaggerDocument;