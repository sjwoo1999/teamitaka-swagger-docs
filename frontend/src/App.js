import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SwaggerDocument from './pages/SwaggerDocument';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/api-docs" element={<SwaggerDocument />} />
            </Routes>
        </Router>
    );
}

export default App;