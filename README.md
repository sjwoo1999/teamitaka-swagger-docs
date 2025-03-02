TeamItaka Swagger Docs 프로젝트
프로젝트 개요
이 프로젝트는 TeamItaka의 백엔드 API 문서를 Swagger UI를 통해 제공하며, 로그인된 사용자만 접근할 수 있도록 보안을 강화한 웹 애플리케이션입니다. 프론트엔드에서 로그인 후 인증된 상태로 Swagger UI로 리다이렉트되며, SOP, CORS, CSRF를 고려한 보안 설정이 적용되어 있습니다.

주요 기능
로그인: 프론트엔드에서 이메일과 비밀번호를 통해 로그인.
인증: JWT를 통한 사용자 인증.
Swagger UI 접근 제어: 인증된 사용자만 Swagger UI에 접근 가능.
보안: CORS, CSRF 방지 설정 적용.
프로젝트 구조
Mono-repo 구조로 프론트엔드와 백엔드를 각각의 디렉토리로 관리합니다.

text
Wrap
Copy
teamitaka-swagger-docs/
├── backend/
│   ├── index.js          # 백엔드 서버 코드
│   └── swagger.yaml      # API 문서 정의 파일
├── frontend/
│   └── index.html        # 프론트엔드 로그인 페이지
├── package.json          # 프로젝트 의존성 관리
└── README.md             # 프로젝트 설명 파일
설정 및 의존성
백엔드 (localhost:5001)
의존성: express, cors, jsonwebtoken, csurf, cookie-parser, swagger-ui-express, yaml
CORS 설정: localhost:3000에서 오는 요청을 허용.
CSRF 방지: 로그인 요청에 CSRF 토큰 요구.
JWT 인증: Swagger UI 접근 시 JWT 검증.
프론트엔드 (localhost:3000)
파일: index.html에 로그인 폼과 로직 포함.
로컬 서버: serve 또는 live-server를 사용하여 실행.
실행 방법
1. 의존성 설치
백엔드와 프론트엔드 의존성을 설치합니다.

bash
Wrap
Copy
# 백엔드 의존성 설치
npm install express cors jsonwebtoken csurf cookie-parser swagger-ui-express yaml

# 프론트엔드 의존성 (serve 사용 시)
npm install -g serve
2. 백엔드 실행
백엔드 디렉토리로 이동하여 서버를 실행합니다.

bash
Wrap
Copy
node index.js
3. 프론트엔드 실행
프론트엔드 디렉토리로 이동하여 로컬 서버를 실행합니다.

bash
Wrap
Copy
serve frontend -p 3000
또는 VS Code의 Live Server 확장을 사용해 index.html을 엽니다.

4. Swagger UI 접근
로그인 페이지(http://localhost:3000)에서 이메일과 비밀번호를 입력하여 로그인.
성공 시 http://localhost:5001/api-docs로 리다이렉트되어 Swagger UI가 표시됩니다.
보안 설정
1. SOP (Same-Origin Policy)
프론트엔드(localhost:3000)와 백엔드(localhost:5001)는 포트가 달라 다른 출처로 간주되므로, CORS 설정을 통해 접근을 허용.
2. CORS
백엔드에서 localhost:3000 출처를 허용하고, credentials: true로 인증 정보 전송을 허용.
3. CSRF
로그인 요청 시 CSRF 토큰을 요구하여 공격 방지.
프론트엔드에서 CSRF 토큰을 받아 로그인 요청에 포함.
4. JWT 인증
로그인 성공 시 JWT 발급.
Swagger UI 접근 시 JWT를 검증하여 인증된 사용자만 접근 가능.
추가 파일
swagger.yaml
API 문서를 정의하는 파일로, 프로젝트 루트 또는 백엔드 폴더에 위치합니다. 아래는 기본 예시입니다.

yaml
Wrap
Copy
openapi: 3.0.0
info:
  title: TeamItaka API
  version: 1.0.0
paths:
  /auth/login:
    post:
      summary: 사용자 로그인
      responses:
        '200':
          description: 로그인 성공
.env (선택)
JWT 비밀키를 안전하게 관리하기 위해 사용합니다.

text
Wrap
Copy
JWT_SECRET=your-secret-key-here
결론
이 프로젝트는 로그인 후 인증된 사용자만 Swagger UI를 통해 API 문서에 접근할 수 있도록 설정되었습니다. SOP, CORS, CSRF를 고려한 보안 설정이 적용되어 있으며, JWT를 통해 사용자 인증을 관리합니다. 문제가 발생하면 백엔드 로그와 프론트엔드 콘솔을 확인하세요.