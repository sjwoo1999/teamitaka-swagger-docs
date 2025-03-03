require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

const app = express();
const port = process.env.PORT || 3001;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// JWT 인증 미들웨어
const authenticateJWT = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '토큰이 없습니다.'});
    try {
        const decoded = await admin.auth().verifyIdtoken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({message: '유효하지 않은 토큰입니다.'});
    }
}

// Swagger 문서 로드
const swaggerFile = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

// 미들웨어 설정
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(csurf({ cookie: { httpOnly: true, secure: false } }));

// CSRF 토큰 발급
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 로그인 엔드포인트
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.json({ message: '로그인 성공', token });
  } else {
    res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
  }
});

// 보호된 Swagger 문서 제공
app.use('/api-docs', authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 서버 시작
app.listen(port, () => console.log(`서버가 ${port}번 포트에서 실행 중`));