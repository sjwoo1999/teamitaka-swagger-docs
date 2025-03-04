<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeamItaka Swagger Docs 프로젝트</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.7;
        }
        header {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            border-radius: 10px;
            margin-bottom: 40px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        header h1 {
            margin: 0;
            font-size: 2.8em;
            letter-spacing: 1px;
        }
        header p {
            margin: 10px 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .section {
            background: white;
            padding: 25px;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s;
        }
        .section:hover {
            transform: translateY(-5px);
        }
        h2 {
            color: #2c3e50;
            font-size: 1.8em;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-top: 0;
        }
        h3 {
            color: #34495e;
            font-size: 1.4em;
            margin-bottom: 10px;
        }
        p {
            margin: 15px 0;
            font-size: 1.1em;
        }
        ul, ol {
            margin-left: 20px;
            padding-left: 10px;
        }
        li {
            margin: 10px 0;
            position: relative;
        }
        ul li::before {
            content: "➜";
            color: #3498db;
            position: absolute;
            left: -20px;
            font-weight: bold;
        }
        pre {
            background-color: #2d2d2d;
            color: #f0f0f0;
            padding: 20px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.95em;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            margin: 15px 0;
        }
        code {
            background-color: #ecf0f1;
            padding: 3px 6px;
            border-radius: 3px;
            font-family: 'Fira Code', 'Courier New', monospace;
            color: #e74c3c;
        }
        a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
            color: #2980b9;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 10px;
            border-left: 4px solid #f1c40f;
            margin: 15px 0;
            border-radius: 4px;
        }
        footer {
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
            color: #7f8c8d;
            border-top: 1px solid #ddd;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <header>
        <h1>TeamItaka Swagger Docs</h1>
        <p>안전하고 편리한 API 문서 접근을 위한 프로젝트</p>
    </header>

    <div class="section">
        <h2>프로젝트 소개</h2>
        <p>
            <strong>TeamItaka Swagger Docs</strong>는 백엔드 API 문서를 <code>Swagger UI</code>로 제공하며, 로그인된 사용자만 접근할 수 있도록 보안을 강화한 프로젝트입니다. 프론트엔드에서 로그인 후 인증된 상태로 Swagger UI로 리다이렉트되며, <code>SOP</code>, <code>CORS</code>, <code>CSRF</code>를 고려한 보안 설정이 적용되었습니다.
        </p>
    </div>

    <div class="section">
        <h2>주요 기능</h2>
        <ul>
            <li><strong>로그인</strong>: 이메일과 비밀번호로 사용자 인증</li>
            <li><strong>JWT 기반 인증</strong>: 보안 토큰으로 접근 제어</li>
            <li><strong>Swagger UI 제한</strong>: 인증된 사용자만 문서 열람 가능</li>
            <li><strong>보안 강화</strong>: CORS 및 CSRF 방지 설정</li>
        </ul>
    </div>

    <div class="section">
        <h2>프로젝트 구조</h2>
        <p>Mono-repo 방식으로 프론트엔드와 백엔드를 관리합니다.</p>
        <pre><code>teamitaka-swagger-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml      # 배포 워크플로우
├── backend/
│   ├── src/               # 백엔드 소스
│   ├── .env               # 환경 변수
│   └── package.json       # 의존성 관리
├── frontend/
│   ├── src/               # 프론트엔드 소스
│   ├── public/            # 정적 파일
│   └── package.json       # 의존성 관리
└── md/
    └── README.html        # 이 문서
</code></pre>
    </div>

    <div class="section">
        <h2>설치 및 실행</h2>
        <h3>1. 의존성 설치</h3>
        <pre><code class="language-bash">cd backend
npm install
cd ../frontend
npm install
</code></pre>

        <h3>2. 백엔드 실행</h3>
        <pre><code class="language-bash">cd backend
node index.js
</code></pre>

        <h3>3. 프론트엔드 실행</h3>
        <pre><code class="language-bash">cd frontend
npm start
</code></pre>
        <p>브라우저에서 <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>에 접속하여 로그인 후 <code>/api-docs</code>로 이동하세요.</p>
    </div>

    <div class="section">
        <h2>배포 설정</h2>
        <p>GitHub Actions로 Firebase Hosting에 배포합니다.</p>
        <div class="highlight">
            <strong>참고</strong>: <code>FIREBASE_SERVICE_ACCOUNT_KEY</code>를 GitHub Secrets에 등록하세요.
        </div>
        <pre><code class="language-yaml">name: Firebase Deploy
on:
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
        working-directory: ./frontend
      - run: npm run build
        working-directory: ./frontend
      - run: npm install -g firebase-tools
      - run: echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}" > serviceAccountKey.json
      - run: firebase deploy --only hosting --project teamitaka-swagger
        working-directory: ./frontend
</code></pre>
    </div>

    <div class="section">
        <h2>보안 설정</h2>
        <ul>
            <li><strong>SOP</strong>: CORS로 다른 출처 간 통신 허용</li>
            <li><strong>CORS</strong>: <code>localhost:3000</code>만 허용</li>
            <li><strong>CSRF</strong>: 토큰 기반 방어 적용</li>
            <li><strong>JWT</strong>: Firebase로 인증 관리</li>
        </ul>
    </div>

    <footer>
        <p>© 2023 TeamItaka. 모든 권리 보유.</p>
    </footer>
</body>
</html>