const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(require('./src/middleware/cors')); // CORS 설정
app.use(cookieParser());
app.use(express.json());
app.use(require('./src/middleware/csrf')); // CSRF 보호

// 라우트
app.use('/auth', require('./src/routes/auth'));
app.use('/api-docs', require('./src/routes/apiDocs'));
app.use('/', require('./src/routes/csrf'));

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});