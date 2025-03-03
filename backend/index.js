const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Swagger 문서 로드 및 오류 처리
let swaggerDocument;
try {
    const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
    swaggerDocument = yaml.parse(swaggerFile);
} catch (error) {
    if (error.code === 'ENOENT') {
        console.error('Error: swagger.yaml 파일을 찾을 수 없습니다. backend 디렉토리에 생성해주세요.');
    } else {
        console.error('swagger.yaml 파일 읽기 오류:', error.message);
    }
    process.exit(1); // 오류 발생 시 서버 종료
}

// 미들웨어 설정
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(csurf({ cookie: { httpOnly: true, secure: false } })); // HTTPS 사용 시 secure: true로 변경

// CSRF 토큰 발급 엔드포인트
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        req.user = user;
        next();
    });
};

// 로그인 엔드포인트
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    // 실제 프로덕션 환경에서는 DB에서 사용자 인증 필요
    if (username === 'aa' && password === 'password123') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false }); // HTTPS 사용 시 secure: true
        res.json({ message: '로그인 성공', token });
    } else {
        res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
    }
});

// 보호된 Swagger 문서 제공
app.use('/api-docs', authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});