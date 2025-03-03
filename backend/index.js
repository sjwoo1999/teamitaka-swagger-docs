const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'your_secret_key'; // 실제 프로젝트에서는 안전한 키로 대체하세요

// CORS 설정
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // JSON 요청 파싱을 위해 추가

// swagger.yaml 파일 읽기 및 파싱
const swaggerFile = fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

// 로그인 엔드포인트
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    // 간단한 인증 로직 (실제로는 데이터베이스와 연동 필요)
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: '로그인 실패' });
});

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer 토큰 형식 가정
    if (!token) return res.redirect('http://localhost:3000');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.redirect('http://localhost:3000');
        req.user = user;
        next();
    });
};

// Swagger UI 설정 (인증 필요)
app.use('/api-docs', authenticateToken, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 기본 라우트
app.get('/', (req, res) => {
    res.send('백엔드 서버가 실행 중입니다!');
});

// 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행 중`));