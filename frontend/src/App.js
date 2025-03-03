import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/api-docs" element={<div>Swagger 문서로 리다이렉트 중...</div>} />
            </Routes>
        </Router>
    );
}

export default App;