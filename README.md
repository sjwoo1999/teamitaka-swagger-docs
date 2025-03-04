<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeamItaka Swagger Docs 프로젝트</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        h1, h2, h3 {
            color: #333;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        ul, ol {
            margin-left: 20px;
        }
    </style>
</head>
<body>
    <h1>TeamItaka Swagger Docs 프로젝트</h1>

    <h2>프로젝트 개요</h2>
    <p>이 프로젝트는 <strong>TeamItaka</strong>의 백엔드 API 문서를 Swagger UI를 통해 제공하며, 로그인된 사용자만 접근할 수 있도록 보안을 강화한 웹 애플리케이션입니다. 프론트엔드에서 로그인 후 인증된 상태로 Swagger UI로 리다이렉트되며, <strong>SOP</strong>, <strong>CORS</strong>, <strong>CSRF</strong>를 고려한 보안 설정이 적용되어 있습니다.</p>

    <h3>주요 기능</h3>
    <ul>
        <li><strong>로그인</strong>: 프론트엔드에서 이메일과 비밀번호를 통해 로그인.</li>
        <li><strong>인증</strong>: JWT를 통한 사용자 인증.</li>
        <li><strong>Swagger UI 접근 제어</strong>: 인증된 사용자만 Swagger UI에 접근 가능.</li>
        <li><strong>보안</strong>: CORS, CSRF 방지 설정 적용.</li>
    </ul>

    <hr>

    <h2>프로젝트 구조</h2>
    <p>Mono-repo 구조로 프론트엔드와 백엔드를 각각의 디렉토리로 관리합니다.</p>
    <pre><code>teamitaka-swagger-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 설정
├── backend/
│   ├── src/
│   │   ├── config/           # 설정 파일 (예: swagger.js)
│   │   ├── controllers/      # API 컨트롤러
│   │   ├── middleware/       # 인증 및 보안 미들웨어
│   │   └── routes/           # API 라우트
│   ├── .env                  # 환경 변수
│   ├── .gitignore            # Git 무시 파일
│   ├── index.js              # 백엔드 서버 코드
│   ├── package.json          # 백엔드 의존성 관리
│   └── swagger.yaml          # API 문서 정의 파일
├── frontend/
│   ├── public/               # 정적 파일
│   ├── src/                  # React 소스 코드
│   ├── .env                  # 환경 변수
│   ├── .gitignore            # Git 무시 파일
│   ├── package.json          # 프론트엔드 의존성 관리
│   └── README.md             # 프론트엔드 설명
└── README.md                 # 프로젝트 전체 설명
</code></pre>

    <hr>

    <h2>설정 및 의존성</h2>

    <h3>백엔드 (<code>localhost:3001</code>)</h3>
    <ul>
        <li><strong>의존성</strong>: <code>express</code>, <code>cors</code>, <code>jsonwebtoken</code>, <code>csurf</code>, <code>cookie-parser</code>, <code>swagger-ui-express</code>, <code>yaml</code>, <code>firebase-admin</code></li>
        <li><strong>CORS 설정</strong>: <code>localhost:3000</code>에서 오는 요청을 허용.</li>
        <li><strong>CSRF 방지</strong>: 로그인 요청에 CSRF 토큰 요구.</li>
        <li><strong>JWT 인증</strong>: Firebase Admin SDK를 사용한 JWT 검증으로 Swagger UI 접근 제어.</li>
    </ul>

    <h3>프론트엔드 (<code>localhost:3000</code>)</h3>
    <ul>
        <li><strong>파일</strong>: React 기반으로 <code>src/</code> 디렉토리에 로그인 로직 포함.</li>
        <li><strong>로컬 서버</strong>: <code>npm start</code>로 실행하거나 Firebase Hosting에 배포.</li>
    </ul>

    <hr>

    <h2>배포 설정</h2>
    <p>GitHub Actions를 활용하여 Firebase Hosting에 자동 배포됩니다. <code>main</code> 브랜치는 프로덕션, <code>develop</code> 브랜치는 개발 환경으로 배포됩니다.</p>
    <pre><code class="language-yaml">name: Firebase Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build the project
        run: npm run build
        env:
          CI: false

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Deploy to Firebase
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            firebase deploy --only hosting:production --project teamitaka-swagger
          elif [ "${{ github.ref }}" == "refs/heads/develop" ]; then
            firebase deploy --only hosting:development --project teamitaka-swagger
          fi
</code></pre>

    <hr>

    <h2>실행 방법</h2>

    <h3>1. 의존성 설치</h3>
    <p>백엔드와 프론트엔드 의존성을 설치합니다.</p>
    <pre><code class="language-bash"># 백엔드 의존성 설치
cd backend
npm install express cors jsonwebtoken csurf cookie-parser swagger-ui-express yaml firebase-admin
</code></pre>
    <pre><code class="language-bash"># 프론트엔드 의존성 설치
cd frontend
npm install
</code></pre>

    <h3>2. 백엔드 실행</h3>
    <p>백엔드 디렉토리로 이동하여 서버를 실행합니다.</p>
    <pre><code class="language-bash">cd backend
node index.js
</code></pre>

    <h3>3. 프론트엔드 실행</h3>
    <p>프론트엔드 디렉토리로 이동하여 개발 서버를 실행합니다.</p>
    <pre><code class="language-bash">cd frontend
npm start
</code></pre>
    <p>또는 Firebase Hosting에 배포 후 확인합니다.</p>

    <h3>4. Swagger UI 접근</h3>
    <ul>
        <li>로그인 페이지(<code>http://localhost:3000</code>)에서 이메일과 비밀번호를 입력하여 로그인.</li>
        <li>성공 시 <code>http://localhost:3001/api-docs</code>로 리다이렉트되어 Swagger UI가 표시됩니다.</li>
    </ul>

    <hr>

    <h2>보안 설정</h2>

    <h3>1. SOP (Same-Origin Policy)</h3>
    <p>프론트엔드(<code>localhost:3000</code>)와 백엔드(<code>localhost:3001</code>)는 포트가 달라 다른 출처로 간주되므로, CORS 설정을 통해 접근을 허용합니다.</p>

    <h3>2. CORS</h3>
    <p>백엔드에서 <code>localhost:3000</code> 출처를 허용하고, <code>credentials: true</code>로 인증 정보 전송을 허용합니다.</p>

    <h3>3. CSRF</h3>
    <p>로그인 요청 시 CSRF 토큰을 요구하여 공격을 방지합니다. 프론트엔드에서 <code>/csrf-token</code> 엔드포인트를 호출해 토큰을 받아 요청에 포함합니다.</p>

    <h3>4. JWT 인증</h3>
    <p>로그인 성공 시 JWT를 발급하며, Swagger UI 접근 시 Firebase Admin SDK를 통해 JWT를 검증하여 인증된 사용자만 접근 가능하도록 합니다.</p>

    <hr>

    <h2>추가 파일</h2>

    <h3><code>index.js</code> (백엔드)</h3>
    <p>백엔드 서버의 주요 코드입니다.</p>
    <pre><code class="language-javascript">require('dotenv').config();
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

const authenticateJWT = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

const swaggerFile = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(csurf({ cookie: { httpOnly: true, secure: false } }));

app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

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

app.use('/api-docs', authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`서버가 ${port}번 포트에서 실행 중`));
</code></pre>

    <h3><code>swagger.yaml</code></h3>
    <p>API 문서를 정의하는 파일로, 주요 엔드포인트를 포함합니다.</p>
    <pre><code class="language-yaml">openapi: 3.0.0
info:
  title: Teamitaka Backend API
  version: 1.0.0
  description: Teamitaka 백엔드 API 문서
paths:
  /auth/login:
    post:
      summary: 사용자 로그인
      description: 사용자가 로그인하여 JWT 토큰을 발급받습니다.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
              required:
                - email
                - password
      responses:
        '200':
          description: 로그인 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: '✅ 로그인 성공!'
                  token:
                    type: string
                    description: JWT 토큰
        '401':
          description: 인증 실패
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /admin/certified-users:
    get:
      summary: 인증된 유저 목록 조회
      description: 인증된 사용자 목록을 조회합니다.
      responses:
        '200':
          description: 인증된 유저 목록 반환
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
      security:
        - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Error:
      type: object
      properties:
        message:
          type: string
          description: 오류 메시지
      required:
        - message
    User:
      type: object
      properties:
        user_id:
          type: string
          description: 사용자 ID
        email:
          type: string
          description: 이메일
</code></pre>

    <h3><code>.env</code> (선택)</h3>
    <p>환경 변수를 안전하게 관리합니다.</p>
    <pre><code class="language-shell">JWT_SECRET=your-secret-key-here
ALLOWED_ORIGIN=http://localhost:3000
PORT=3001
</code></pre>

    <hr>

    <h2>결론</h2>
    <p>이 프로젝트는 로그인 후 인증된 사용자만 Swagger UI를 통해 API 문서에 접근할 수 있도록 설정되었습니다. SOP, CORS, CSRF를 고려한 보안 설정과 Firebase Admin SDK를 활용한 JWT 인증이 적용되어 있으며, GitHub Actions를 통해 Firebase Hosting에 자동 배포됩니다. 문제가 발생하면 백엔드 로그와 프론트엔드 콘솔을 확인하세요.</p>
</body>
</html>