# TeamItaka Swagger Docs 프로젝트

## 개요
이 프로젝트는 **TeamItaka**의 백엔드 API 문서를 Swagger UI를 통해 제공하는 웹 애플리케이션입니다. 로그인된 사용자만 접근할 수 있도록 보안을 강화했으며, **SOP**, **CORS**, **CSRF** 같은 보안 요소를 고려해 설정했습니다. 프론트엔드에서 로그인 후 인증된 상태로 Swagger UI로 리다이렉트됩니다.

## 주요 기능
- **로그인**: 이메일과 비밀번호로 사용자 인증.
- **JWT 기반 인증**: Firebase Admin SDK를 사용한 토큰 검증.
- **Swagger UI 접근 제어**: 인증된 사용자만 API 문서에 접근 가능.
- **보안**: CORS와 CSRF 방지 설정 적용.

## 프로젝트 구조
Mono-repo 구조로 프론트엔드와 백엔드를 각각의 디렉토리로 관리합니다.

```
teamitaka-swagger-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 설정
├── backend/
│   ├── src/
│   │   ├── config/           # 설정 파일 (swagger.js 등)
│   │   ├── controllers/      # API 컨트롤러
│   │   ├── middleware/       # 인증 및 보안 미들웨어
│   │   └── routes/           # API 라우트
│   ├── .env                  # 환경 변수
│   ├── .gitignore            # Git 무시 파일
│   ├── index.js              # 백엔드 서버 코드
│   ├── package.json          # 백엔드 의존성
│   └── swagger.yaml          # Swagger API 정의
├── frontend/
│   ├── public/               # 정적 파일
│   ├── src/                  # React 소스 코드
│   ├── .env                  # 환경 변수
│   ├── .gitignore            # Git 무시 파일
│   ├── package.json          # 프론트엔드 의존성
│   └── README.md             # 프론트엔드 설명
└── README.md                 # 프로젝트 전체 설명
```


## 설치 및 실행

### 1. 의존성 설치
#### 백엔드
```bash
cd backend
npm install express cors jsonwebtoken csurf cookie-parser swagger-ui-express yaml firebase-admin
```

#### 백엔드
```bash
cd frontend
npm install
```

### 2. 환경 변수 설정
백엔드와 프론트엔드에 `.env` 파일을 생성하고 아래 내용을 추가하세요.

`backend/.env`

```text
PORT=3001
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGIN=http://localhost:3000
```

`frontend/.env`

```text
REACT_APP_API_URL=http://localhost:3001
```

### 3. 서버 실행

백엔드

```bash
cd backend
node index.js
```

프론트엔드

```bash
cd frontend
npm start
```

### 4. Swagger UI 접근

1. 브라우저에서 `http://localhost:3000`에 접속하세요.
2. 로그인 페이지에서 이메일과 비밀번호를 입력하세요.
3. 인증 성공 시 `http://localhost:3001/api-docs`로 이동해 Swagger UI를 확인하실 수 있습니다.

## 배포 설정

GitHub Actions를 통해 Firebase Hosting에 자동 배포됩니다.

`deploy.yml` 예시

```yaml
name: Firebase Deploy

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
```

## 보안 설정

- **SOP(Same-Origin Policy)** : 프론트엔드 (`localhost:3000`)와 백엔드(`localhost:3001`)의 출처가 다르므로 CORS 설정을 통해 접근을 허용.
- **CORS** : 백엔드에서 `localhost:3000` 출처를 허용하고 인증 정보 전송을 지원.
- **CSRF** : 로그인 요청 시 CSRF 토큰을 요구해 공격을 방지.
- **JWT 인증** : 로그인 성공 시 JWT 발급, Swagger UI 접근 시 Firebase Admin SDK로 토큰 검증.

## 결론

이 프로젝트는 인증된 사용자만 Swagger UI를 통해 API 문서에 접근할 수 있도록 설계되었습니다. 보안 설정과 GitHub Actions를 통한 배포가 포함되어 있으며, 마크다운 형식으로 제공되었습니다.