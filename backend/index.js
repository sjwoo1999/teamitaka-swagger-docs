// index.js

// 1. 의존성 가져오기
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');

// 2. Express 앱 초기화
const app = express();
const port = process.env.PORT || 3000; // 환경 변수 또는 기본 포트 3000 사용

// 3. 미들웨어 설정
// CORS 설정: 프론트엔드 (포트 5000)에서 접근 허용, 쿠키 포함 요청 허용
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));
app.use(cookieParser()); // 쿠키 파싱
app.use(csurf({ cookie: true })); // CSRF 보호, 쿠키 사용
app.use(express.json()); // JSON 요청 본문 파싱

// 4. Swagger 설정
// swagger.yaml 파일 읽기 및 파싱, /api-docs 경로에서 Swagger UI 제공
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5. 기본 라우트: 환영 메시지
app.get('/', (req, res) => {
    res.send('Teamitaka API에 오신 것을 환영합니다!');
});

// 6. JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; // 쿠키에서 토큰 추출
    if (token) {
        jwt.verify(token, 'your-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
            }
            req.user = user; // 검증된 사용자 정보를 요청 객체에 추가
            next();
        });
    } else {
        res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }
};

// 7. 로그인 엔드포인트
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // 간단한 인증 로직 (실제로는 DB 사용 추천)
    if (username === 'aa' && password === 'password123') {
        const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false }); // 개발 환경에서는 secure: false
        res.json({ message: '로그인 성공', token });
    } else {
        res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
    }
});

// 8. 보호된 라우트
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({
        message: '보호된 데이터에 접근 성공',
        user: req.user
    });
});

// 9. 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});