<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Teamitaka Swagger Docs 프로젝트</h1>
    <h2>개요</h2>
    <p>
        TeamItaka Swagger Docs 프로젝트는 TeamItaka의 백엔드 API 문서를 <strong>Swagger UI</strong>를 통해 제공하는 웹 애플리케이션입니다. 이 프로젝트는 로그인된 사용자만 접근할 수 있도록 보안을 강화했으며, <em>SOP(Same-Origin Policy)</em>, <em>CORS</em>, <em>CSRF</em>와 같은 보안 요소를 고려하여 설정되었습니다. 프론트엔드는 <strong>React</strong> 기반의 정적 웹 인터페이스로 구성되며, 백엔드는 <strong>Firebase Functions</strong>를 활용한 서버리스 로직으로 처리됩니다. 사용자는 프론트엔드에서 로그인 후 인증된 상태로 Swagger UI로 리다이렉트됩니다. 배포는 <strong>Firebase Hosting</strong>과 <strong>GitHub Actions</strong>를 통해 자동화됩니다.
    </p>
    <h2>주요 기능</h2>
    <ul>
        <li><strong>로그인</strong>: 이메일과 비밀번호를 통한 사용자 인증.</li>
        <li><strong>JWT 기반 인증</strong>: Firebase Admin SDK를 활용한 토큰 검증.</li>
        <li><strong>Swagger UI 접근 제어</strong>: 인증된 사용자만 API 문서에 접근 가능.</li>
        <li><strong>보안</strong>: CORS와 CSRF 방지 설정 적용.</li>
        <li><strong>프론트엔드</strong>: React 기반으로 Swagger UI를 시각적으로 표시.</li>
        <li><strong>백엔드</strong>: Firebase Functions를 통해 서버리스 API 문서 관리.</li>
    </ul>
    <h2>프로젝트 구조</h2>
    <p>
        Mono-repo 구조를 사용하여 프론트엔드와 백엔드를 각각의 디렉토리로 관리합니다. 아래는 프로젝트의 디렉토리 구조입니다:
    </p>
    <pre><code class="language-text">teamitaka-swagger-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 배포 설정
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
│   │   ├── pages/            # MainPage.js, LoginPage.js 등
│   │   └── index.js          # 프론트엔드 진입점
│   ├── .env                  # 환경 변수
│   ├── .gitignore            # Git 무시 파일
│   ├── package.json          # 프론트엔드 의존성
│   └── README.md             # 프론트엔드 설명
├── .prettierrc               # 코드 포맷팅 설정
└── README.md                 # 프로젝트 전체 설명</code></pre>
    <h2>설치 및 실행</h2>
    <h3>1. 의존성 설치</h3>
    <h4>백엔드</h4>
    <pre><code class="language-bash">
cd backend
npm install express cors jsonwebtoken csurf cookie-parser swagger-ui-express swagger-jsdoc yaml firebase-admin
    </code></pre>
    <h4>프론트엔드</h4>
    <pre><code class="language-bash">
cd frontend
npm install
    </code></pre>
    <h3>2. 환경 변수 설정</h3>
    <p>백엔드와 프론트엔드에 <code>.env</code> 파일을 생성하고 아래 내용을 추가하세요.</p>
    <h4>backend/.env</h4>
    <pre><code class="language-text">
PORT=3001
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGIN=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_KEY_B64=<Base64-encoded-service-account-key>
    </code></pre>
    <h4>frontend/.env</h4>
    <pre><code class="language-text">
REACT_APP_API_URL=http://localhost:3001
    </code></pre>
    <p><small>참고: <code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code>는 Firebase 콘솔에서 서비스 계정 키를 다운로드한 후, Base64로 인코딩하여 추가해야 합니다. 예: <code>base64 serviceAccountKey.json > encoded_key.txt</code></small></p>
    <h3>3. 서버 실행</h3>
    <h4>백엔드</h4>
    <pre><code class="language-bash">
cd backend
node index.js
    </code></pre>
    <h4>프론트엔드</h4>
    <pre><code class="language-bash">
cd frontend
npm start
    </code></pre>
    <h3>4. Swagger UI 접근</h3>
    <ol>
        <li>브라우저에서 <a href="http://localhost:3000">http://localhost:3000</a>에 접속하세요.</li>
        <li>로그인 페이지에서 이메일과 비밀번호를 입력하세요.</li>
        <li>인증 성공 시 <a href="http://localhost:3001/api-docs">http://localhost:3001/api-docs</a>로 이동하여 Swagger UI를 확인할 수 있습니다.</li>
    </ol>
    <h2>배포 설정</h2>
    <p>
        프로젝트는 <strong>GitHub Actions</strong>를 통해 <strong>Firebase Hosting</strong>에 자동 배포됩니다. 배포 과정에서 서비스 계정 키의 올바른 설정이 필수적이며, 최근 작업에서 이를 개선했습니다.
    </p>
    <h3>서비스 계정 키 관리</h3>
    <ol>
        <li><strong>다운로드</strong>: Firebase 콘솔에서 서비스 계정 키(<code>serviceAccountKey.json</code>)를 다운로드합니다.</li>
        <li><strong>인코딩</strong>: Base64로 인코딩합니다:
            <pre><code class="language-bash">
base64 serviceAccountKey.json > encoded_key.txt
            </code></pre>
        </li>
        <li><strong>저장</strong>: GitHub Repository Settings > Secrets에 <code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code>로 저장합니다.</li>
    </ol>
    <h3>deploy.yml 예시</h3>

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
                echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY_B64 }}" | base64 -d > ../backend/serviceAccountKey.json
                if [ "${{ github.ref }}" == "refs/heads/main" ]; then
                    firebase deploy --only hosting:production --project teamitaka-swagger
                elif [ "${{ github.ref }}" == "refs/heads/develop" ]; then
                    firebase deploy --only hosting:development --project teamitaka-swagger
                fi
                env:
                FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
</code>

<h2>보안 설정</h2>
    <ul>
        <li><strong>SOP(Same-Origin Policy)</strong>: 프론트엔드(localhost:3000)와 백엔드(localhost:3001)의 출처가 다르므로 CORS 설정을 통해 접근을 허용.</li>
        <li><strong>CORS</strong>: 백엔드에서 <code>ALLOWED_ORIGIN</code>에 지정된 출처만 허용하며, 인증 정보 전송을 지원.</li>
        <li><strong>CSRF</strong>: 로그인 요청 시 CSRF 토큰을 요구하여 공격 방지.</li>
        <li><strong>JWT 인증</strong>: 로그인 성공 시 JWT 발급, Swagger UI 접근 시 Firebase Admin SDK로 토큰 검증.</li>
    </ul>
    <h2>작업 로그 (2025년 3월 5일)</h2>
    <p>2025년 3월 5일은 프로젝트 배포가 완료된 중요한 날입니다. 아래는 당일 작업의 상세 내역입니다:</p>
    <ul>
        <li><strong>Firebase 설정 완료</strong>: Firebase Hosting과 Functions 설정을 최종 점검.</li>
        <li><strong>프로덕션 환경 설정</strong>: 배포 환경을 프로덕션으로 전환.</li>
        <li><strong>오류 해결</strong>: ESLint 오류와 서비스 계정 키 관련 문제를 수정.</li>
    </ul>
    <ul>
        <li><strong>CI/CD 개선</strong>: <code>deploy.yml</code>을 여러 차례 업데이트하여 배포 파이프라인 최적화.</li>
        <li><strong>프론트엔드 배포</strong>: Firebase Hosting을 통해 프론트엔드 배포 완료.</li>
    </ul>
    <ul>
        <li><strong>서비스 계정 오류 발생</strong>: 초기 배포 시 올바르지 않은 서비스 계정 키를 사용함으로써 인증 실패 오류 발생 (<code>SyntaxError: Unexpected token t in JSON at position 4</code>).</li>
        <li><strong>해결 과정</strong>:
            <ol>
                <li>Firebase 콘솔에서 새로운 서비스 계정 키를 생성.</li>
                <li>Base64로 인코딩하여 GitHub Secrets에 <code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code>로 업데이트.</li>
                <li><code>deploy.yml</code>에서 디코딩 로직 추가:
                    <pre><code class="language-bash">
echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY_B64 }}" | base64 -d > ../backend/serviceAccountKey.json
                    </code></pre>
                </li>
            </ol>
        </li>
        <li><strong>배포 완료</strong>: 백엔드와 프론트엔드 배포 설정 완료, 디버그 로그 제거로 깔끔한 출력 보장.</li>
    </ul>
    <h2>작업 로그 (2025년 3월 6일)</h2>
    <p>2025년 3월 6일은 프로젝트 배포가 완료된 중요한 날입니다. 아래는 당일 작업의 상세 내역입니다:</p>
    <ul>
        <li><strong>Firebase 설정 완료</strong>: Firebase Hosting과 Functions 설정을 최종 점검하여 배포 준비를 마무리했습니다.</li>
        <li><strong>프로덕션 환경 설정</strong>: 배포 환경을 개발 환경에서 프로덕션 환경으로 전환했습니다.</li>
        <li><strong>오류 해결</strong>:
            <ul>
                <li>ESLint에서 발생한 코드 품질 관련 오류를 수정했습니다.</li>
                <li>서비스 계정 키 설정 문제로 인해 발생한 인증 오류를 해결했습니다.</li>
            </ul>
        </li>
        <li><strong>CI/CD 개선</strong>: 배포 파이프라인을 최적화하기 위해 <code>deploy.yml</code> 파일을 여러 차례 업데이트했습니다.</li>
        <li><strong>프론트엔드 배포</strong>: Firebase Hosting을 통해 프론트엔드 배포를 성공적으로 완료했습니다.</li>
        <li><strong>서비스 계정 오류 발생 및 해결</strong>:
            <ul>
                <li><strong>오류 발생</strong>: 초기 배포 시 잘못된 서비스 계정 키를 사용해 인증 실패 오류(<code>SyntaxError: Unexpected token t in JSON at position 4</code>)가 발생했습니다。</li>
                <li><strong>해결 과정</strong>:
                    <ol>
                        <li>Firebase 콘솔에서 새로운 서비스 계정 키(<code>serviceAccountKey.json</code>)를 생성했습니다。</li>
                        <li>생성된 키를 Base64로 인코딩하여 GitHub Secrets에 <code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code>로 저장했습니다。</li>
                        <li><code>deploy.yml</code>에 디코딩 로직을 추가하여 올바른 키를 적용했습니다:
                            <pre><code class="language-bash">
echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY_B64 }}" | base64 -d > ../backend/serviceAccountKey.json
                            </code></pre>
                        </li>
                    </ol>
                </li>
            </ul>
        </li>
        <li><strong>배포 완료</strong>: 백엔드와 프론트엔드 배포를 최종적으로 완료했으며, 디버그 로그를 제거하여 깔끔한 출력을 보장했습니다。</li>
    </ul>
    <h2>작업 로그 (2025년 3월 7일)</h2>
    <p>2025년 3월 7일은 로그인 시스템의 보안 설정을 개선한 날입니다. 아래는 작업 상세 내역입니다:</p>
    <ul>
        <li><strong>CSRF 관련 오류 발생</strong>: 로그인 시 CSRF 토큰 요청에서 <code>500 Internal Server Error</code> 발생.</li>
        <li><strong>문제 분석</strong>:
            <ul>
                <li><code>csurf</code> 미들웨어가 Firebase Functions와 비호환성 문제로 토큰 생성에 실패.</li>
                <li>Firebase Authentication의 <code>idToken</code>이 CSRF 공격 방어에 충분하다는 판단.</li>
            </ul>
        </li>
        <li><strong>해결 과정</strong>:
            <ol>
                <li>클라이언트(<code>MainPage.js</code>)에서 CSRF 토큰 요청 로직을 제거하고, <code>idToken</code>을 <code>Authorization</code> 헤더로 전송하도록 수정.</li>
                <li>서버(<code>functions/index.js</code>)에서 <code>csurf</code> 미들웨어와 <code>/csrf-token</code> 엔드포인트를 삭제.</li>
                <li>로컬 및 프로덕션 환경에서 로그인 기능 테스트 후 성공 확인.</li>
            </ol>
        </li>
        <li><strong>코드 예시</strong>:
            <ul>
                <li><strong>클라이언트</strong>:
                    <pre><code class="language-javascript">
const login = async () => {
  await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
};
                    </code></pre>
                </li>
                <li><strong>서버</strong>:
                    <pre><code class="language-javascript">
app.post('/login', (req, res) => {
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => res.status(200).json({ success: true }))
    .catch(error => res.status(401).json({ error }));
});
                    </code></pre>
                </li>
            </ul>
        </li>
        <li><strong>결과</strong>: 불필요한 CSRF 보호 제거로 코드 간소화 및 안정성 향상.</li>
    </ul>
    <h2>작업 로그 (2025년 3월 9일)</h2>
<p>2025년 3월 9일은 CSRF 관련 내용을 제외하고 Firebase Authentication을 활용해 이메일/비밀번호로 로그인을 성공적으로 구현한 날입니다. 아래는 작업 상세 내역입니다:</p>
<ul>
    <li><strong>문제 발생</strong>: CSRF 토큰 요청 시 <code>500 Internal Server Error</code>가 발생하며 로그인 실패.</li>
    <li><strong>문제 분석</strong>:
        <ul>
            <li><code>csurf</code> 미들웨어가 Firebase Functions의 서버리스 환경과 호환되지 않아 토큰 생성 실패.</li>
            <li>Firebase Authentication의 <code>idToken</code>이 CSRF 공격을 방어할 수 있는 충분한 보안성을 제공한다고 판단.</li>
        </ul>
    </li>
    <li><strong>해결 과정</strong>:
        <ol>
            <li>클라이언트(<code>MainPage.js</code>)에서 CSRF 토큰 요청 로직을 제거하고, <code>idToken</code>을 <code>Authorization</code> 헤더로 전송하도록 수정.</li>
            <li>서버(<code>functions/index.js</code>)에서 <code>csurf</code> 미들웨어와 <code>/csrf-token</code> 엔드포인트를 삭제.</li>
            <li>로그인 요청 시 <code>idToken</code>을 검증하는 로직만 유지.</li>
            <li>로컬(<code>firebase emulators:start</code>) 및 프로덕션 환경에서 테스트 후 성공 확인.</li>
        </ol>
    </li>
    <li><strong>코드 예시</strong>:
        <ul>
            <li><strong>클라이언트</strong>:
                <pre><code class="language-javascript">
const login = async () => {
  await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
};
                </code></pre>
            </li>
            <li><strong>서버</strong>:
                <pre><code class="language-javascript">
app.post('/login', (req, res) => {
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => res.status(200).json({ success: true }))
    .catch(error => res.status(401).json({ error }));
});
                </code></pre>
            </li>
        </ul>
    </li>
    <li><strong>결과</strong>: 로그인 기능이 성공적으로 작동하며, CSRF 관련 오류가 해결됨. 코드가 간소화되어 유지보수성 향상.</li>
</ul>
    <h2>결론</h2>
<p>
    TeamItaka Swagger Docs 프로젝트는 인증된 사용자만 Swagger UI를 통해 API 문서에 접근할 수 있도록 설계된 웹 애플리케이션입니다. 프론트엔드는 <strong>React</strong>로 구축되어 직관적이고 사용자 친화적인 인터페이스를 제공하며, 백엔드는 <strong>Firebase Functions</strong>를 활용한 서버리스 아키텍처로 구현되어 확장성과 유지보수성을 갖췄습니다. 배포는 <strong>GitHub Actions</strong>를 통해 자동화되어 개발 워크플로우의 효율성을 높였고, 보안은 <em>CORS</em>와 <em>JWT</em>를 기반으로 설계되었습니다. 초기에는 <em>CSRF</em> 보호도 포함되었으나, 이후 최적화를 위해 제거되었습니다.
</p>
<p>
    프로젝트는 여러 개선 과정을 거쳐 안정성과 보안성을 강화했습니다. 특히, 2025년 3월 5일에 발생한 배포 오류는 잘못된 서비스 계정 키 사용으로 인해 발생한 문제였습니다. 당시 Firebase Functions가 인증에 실패하며 배포 파이프라인이 중단되었는데, 이는 서비스 계정 키(<code>serviceAccountKey.json</code>)가 올바르게 설정되지 않았기 때문입니다. 문제를 해결하기 위해 다음과 같은 단계를 거쳤습니다:
</p>
<ul>
    <li>Firebase 콘솔에서 새로운 서비스 계정 키를 생성했습니다.</li>
    <li>생성된 키를 Base64로 인코딩하여 GitHub Secrets에 <code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code>라는 이름으로 저장했습니다.</li>
    <li>GitHub Actions 워크플로우 파일(<code>deploy.yml</code>)에 디코딩 로직을 추가하여 배포 시 올바른 키를 사용할 수 있도록 설정했습니다:</li>
</ul>
<pre><code class="language-bash">
echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY_B64 }}" | base64 -d > ../backend/serviceAccountKey.json
</code></pre>
<p>
    이 과정을 통해 배포 파이프라인이 안정화되었으며, 서비스 계정 키 관리의 중요성을 다시 한번 확인할 수 있었습니다. 결과적으로, 배포 성공률이 100%로 개선되었고, 이후 추가적인 오류 없이 안정적으로 운영되었습니다.
</p>
<p>
    이어서 2025년 3월 9일에는 로그인 시스템의 보안 설정을 최적화하는 작업을 진행했습니다. 초기에는 <code>csurf</code> 미들웨어를 사용해 CSRF 보호를 적용했으나, Firebase Functions의 서버리스 환경에서 호환성 문제가 발생하며 <code>500 Internal Server Error</code>가 빈발했습니다. 이에 대한 분석 결과, Firebase Authentication에서 제공하는 <code>idToken</code>이 이미 요청 출처를 검증하고 위조된 요청을 방지하는 충분한 보안성을 제공한다는 점을 확인했습니다. CSRF 보호는 중복된 보안 조치로 판단되어 제거하기로 결정했습니다.
</p>
<p>
    CSRF 제거 및 로그인 개선 작업은 다음 단계로 진행되었습니다:
</p>
<ol>
    <li>
        <strong>클라이언트 측 수정</strong>: <code>MainPage.js</code>에서 CSRF 토큰을 요청하는 기존 로직을 삭제했습니다. 대신, Firebase Authentication에서 발급받은 <code>idToken</code>을 <code>Authorization</code> 헤더에 포함해 전송하도록 변경했습니다. 이로 인해 로그인 요청이 간소화되고, 불필요한 네트워크 호출이 줄어들었습니다:
        <pre><code class="language-javascript">const response = await fetch('/api', {
    headers: { Authorization: `Bearer ${idToken}` }
});</code></pre>
    </li>
    <li>
        <strong>서버 측 수정</strong>: <code>functions/index.js</code>에서 <code>csurf</code> 미들웨어와 관련 엔드포인트(<code>/csrf-token</code>)를 제거했습니다. 대신, <code>idToken</code> 검증 로직만 유지하여 인증 흐름을 단순화했습니다:
        <pre><code class="language-javascript">admin.auth().verifyIdToken(idToken).then(decodedToken => {
    // 사용자 인증 성공
});</code></pre>
    </li>
    <li>
        <strong>테스트 및 검증</strong>: 로컬에서 <code>firebase emulators:start</code>를 실행해 수정된 로그인 기능을 테스트했습니다.
    </li>
</ol>
<p>
    이 작업으로 로그인 기능이 안정화되었고, 불필요한 미들웨어 제거로 코드 복잡성이 줄어 유지보수성이 향상되었습니다. 또한, 서버리스 환경에서의 호환성 문제를 예방하며 성능 최적화 효과도 얻을 수 있었습니다.
</p>
<p>
    현재 보안 설정은 <em>CORS</em>와 <em>JWT</em>를 기반으로 하며, Firebase Authentication의 <code>idToken</code>이 핵심 역할을 담당합니다. 향후 계획으로는 Node.js 버전을 최신 상태로 유지하고, 배포 후 발생할 수 있는 잠재적 버그를 신속히 수정하며, 지속적인 보안 및 성능 최적화를 통해 프로젝트를 더욱 발전시킬 예정입니다.
</p>
    <h2>GitHub Actions를 통한 Firebase Functions 배포 가이드라인</h2>
    <p>
        이 가이드라인은 GitHub Actions를 사용하여 Firebase Functions를 배포하는 방법을 상세히 설명합니다. 아래 단계별 지침을 따르면, Firebase Functions를 자동으로 배포하는 워크플로우를 성공적으로 설정할 수 있습니다. 각 단계는 명확하게 설명되어 있으며, 필요한 이유와 방법을 포함합니다。
    </p>
    <h3>1. 사전 준비 사항</h3>
    <ul>
        <li><strong>Firebase 프로젝트 설정</strong>:
            <ul>
                <li><a href="https://console.firebase.google.com/">Firebase 콘솔</a>에 접속하여 새 프로젝트를 생성하거나 기존 프로젝트를 선택하세요。</li>
                <li>프로젝트가 설정되면, <strong>서비스 계정 키</strong>를 생성합니다:
                    <ul>
                        <li>Firebase 콘솔 > <strong>프로젝트 설정</strong> > <strong>서비스 계정</strong>으로 이동합니다。</li>
                        <li><strong>새 비공개 키 생성</strong>을 클릭하여 JSON 형식의 서비스 계정 키 파일(<code>serviceAccountKey.json</code>)을 다운로드합니다。</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><strong>GitHub Secrets 설정</strong>:
            <ul>
                <li>GitHub 리포지토리에서 <strong>Settings</strong> > <strong>Secrets and variables</strong> > <strong>Actions</strong>로 이동합니다。</li>
                <li>다음 두 가지 비밀 변수를 추가합니다:
                    <ol>
                        <li><strong><code>FIREBASE_SERVICE_ACCOUNT_KEY_B64</code></strong>:
                            <ul>
                                <li>다운로드한 <code>serviceAccountKey.json</code> 파일을 Base64로 인코딩합니다。</li>
                                <li>명령어 예시:
                                    <pre><code class="language-bash">base64 -w 0 serviceAccountKey.json > encoded.txt</code></pre>
                                </li>
                                <li>생성된 Base64 문자열을 Secrets에 저장합니다。</li>
                            </ul>
                        </li>
                        <li><strong><code>CLIENT_URL</code></strong>:
                            <ul>
                                <li>프론트엔드 도메인(예: <code>https://your-app.web.app</code>)을 입력합니다。</li>
                                <li>Functions에서 프론트엔드와 통신할 때 사용되므로 정확히 설정하세요。</li>
                            </ul>
                        </li>
                    </ol>
                </li>
            </ul>
        </li>
    </ul>
    <h3>2. Firebase Functions 코드 준비</h3>
    <ul>
        <li><strong>디렉토리 구조</strong>:
            <ul>
                <li>프로젝트 루트에 <code>functions</code> 폴더를 생성합니다。</li>
                <li>기본 구조 예시:
                    <pre><code class="language-text">
your-project/
├── functions/
│   ├── package.json
│   ├── index.js
│   └── config/
│       └── firebase.js
                    </code></pre>
                </li>
                <li><code>functions/package.json</code>에 의존성 추가:
                    <pre><code class="language-json">
{
  "dependencies": {
    "firebase-functions": "^4.0.0",
    "firebase-admin": "^11.0.0"
  }
}
                    </code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Firebase Admin SDK 초기화</strong>:
            <ul>
                <li><code>functions/config/firebase.js</code> 파일을 생성하여 초기화 코드를 작성합니다:</li>
                <li>예시 코드:</li>
<pre><code>const admin = require('firebase-admin');
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} else {
  admin.initializeApp();
}

module.exports = admin;
</code></pre>
                </li>
            </ul>
        </li>
    </ul>
    <h3>3. GitHub Actions 워크플로우 파일 작성</h3>
    <ul>
        <li><strong>파일 생성</strong>:
            <ul>
                <li><code>.github/workflows/deploy.yml</code> 파일을 프로젝트 루트에 생성합니다。</li>
            </ul>
        </li>
        <li><strong>워크플로우 코드</strong>:
            <ul>
                <li>아래는 <code>deploy.yml</code> 예시입니다:</li>
<pre><code>name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy-functions:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./functions
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm ci

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Set up Firebase Service Account
        run: |
          echo "${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY_B64 }}" | base64 -d > ./serviceAccountKey.json

      - name: Deploy to Firebase Functions
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ./serviceAccountKey.json
        run: firebase deploy --only functions --non-interactive --project your-project-id

      - name: Clean up
        if: always()
        run: rm -f ./serviceAccountKey.json
</code></pre>
<li><strong>주의</strong>: <code>your-project-id</code>를 실제 Firebase 프로젝트 ID로 교체하세요。</li>
            </ul>
        </li>
    </ul>
    <h3>4. 배포 후 확인</h3>
    <ul>
        <li><strong>Firebase 콘솔</strong>:
            <ul>
                <li>Firebase 콘솔 > <strong>Functions</strong> 탭에서 배포된 함수를 확인합니다。</li>
                <li>"로그" 탭에서 실행 로그를 점검합니다。</li>
            </ul>
        </li>
        <li><strong>GitHub Actions 로그</strong>:
            <ul>
                <li>GitHub 리포지토리 > <strong>Actions</strong> 탭에서 워크플로우 실행 상태를 확인합니다。</li>
            </ul>
        </li>
    </ul>
    <h3>5. 추가 팁 및 문제 해결</h3>
        <ul>
            <li><strong>문제</strong>: "Permission denied" 오류
                <ul>
                    <li>서비스 계정 키와 프로젝트 ID를 다시 확인하세요。</li>
                </ul>
            </li>
            <li><strong>팁</strong>: 로컬 테스트
                <ul>
                    <li><code>firebase emulators:start</code>로 배포 전 테스트하세요.</li>
                </ul>
            </li>
        </ul>
    </body>
</html>