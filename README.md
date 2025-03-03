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
├── backend/
│   ├── index.js          # 백엔드 서버 코드
│   └── swagger.yaml      # API 문서 정의 파일
├── frontend/
│   └── index.html        # 프론트엔드 로그인 페이지
├── package.json          # 프로젝트 의존성 관리
└── README.md             # 프로젝트 설명 파일
</code></pre>

<hr>

<h2>설정 및 의존성</h2>

<h3>백엔드 (<code>localhost:5001</code>)</h3>
<ul>
  <li><strong>의존성</strong>: <code>express</code>, <code>cors</code>, <code>jsonwebtoken</code>, <code>csurf</code>, <code>cookie-parser</code>, <code>swagger-ui-express</code>, <code>yaml</code></li>
  <li><strong>CORS 설정</strong>: <code>localhost:3000</code>에서 오는 요청을 허용.</li>
  <li><strong>CSRF 방지</strong>: 로그인 요청에 CSRF 토큰 요구.</li>
  <li><strong>JWT 인증</strong>: Swagger UI 접근 시 JWT 검증.</li>
</ul>

<h3>프론트엔드 (<code>localhost:3000</code>)</h3>
<ul>
  <li><strong>파일</strong>: <code>index.html</code>에 로그인 폼과 로직 포함.</li>
  <li><strong>로컬 서버</strong>: <code>serve</code> 또는 <code>live-server</code>를 사용하여 실행.</li>
</ul>

<hr>

<h2>실행 방법</h2>

<h3>1. 의존성 설치</h3>
<p>백엔드와 프론트엔드 의존성을 설치합니다.</p>
<pre><code class="language-bash"># 백엔드 의존성 설치
npm install express cors jsonwebtoken csurf cookie-parser swagger-ui-express yaml

# 프론트엔드 의존성 (serve 사용 시)
npm install -g serve
</code></pre>

<h3>2. 백엔드 실행</h3>
<p>백엔드 디렉토리로 이동하여 서버를 실행합니다.</p>
<pre><code class="language-bash">node index.js
</code></pre>

<h3>3. 프론트엔드 실행</h3>
<p>프론트엔드 디렉토리로 이동하여 로컬 서버를 실행합니다.</p>
<pre><code class="language-bash">serve frontend -p 3000
</code></pre>
<p>또는 VS Code의 <code>Live Server</code> 확장을 사용해 <code>index.html</code>을 엽니다.</p>

<h3>4. Swagger UI 접근</h3>
<ul>
  <li>로그인 페이지(<code>http://localhost:3000</code>)에서 이메일과 비밀번호를 입력하여 로그인.</li>
  <li>성공 시 <code>http://localhost:5001/api-docs</code>로 리다이렉트되어 Swagger UI가 표시됩니다.</li>
</ul>

<hr>

<h2>보안 설정</h2>

<h3>1. SOP (Same-Origin Policy)</h3>
<p>프론트엔드(<code>localhost:3000</code>)와 백엔드(<code>localhost:5001</code>)는 포트가 달라 다른 출처로 간주되므로, CORS 설정을 통해 접근을 허용.</p>

<h3>2. CORS</h3>
<p>백엔드에서 <code>localhost:3000</code> 출처를 허용하고, <code>credentials: true</code>로 인증 정보 전송을 허용.</p>

<h3>3. CSRF</h3>
<p>로그인 요청 시 CSRF 토큰을 요구하여 공격 방지. 프론트엔드에서 CSRF 토큰을 받아 로그인 요청에 포함.</p>

<h3>4. JWT 인증</h3>
<p>로그인 성공 시 JWT 발급. Swagger UI 접근 시 JWT를 검증하여 인증된 사용자만 접근 가능.</p>

<hr>

<h2>추가 파일</h2>

<h3><code>swagger.yaml</code></h3>
<p>API 문서를 정의하는 파일로, 프로젝트 루트 또는 백엔드 폴더에 위치합니다. 아래는 기본 예시입니다.</p>
<pre><code class="language-yaml">openapi: 3.0.0
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
</code></pre>

<h3><code>.env</code> (선택)</h3>
<p>JWT 비밀키를 안전하게 관리하기 위해 사용합니다.</p>
<pre><code class="language-shell">JWT_SECRET=your-secret-key-here
</code></pre>

<hr>

<h2>결론</h2>
<p>이 프로젝트는 로그인 후 인증된 사용자만 Swagger UI를 통해 API 문서에 접근할 수 있도록 설정되었습니다. SOP, CORS, CSRF를 고려한 보안 설정이 적용되어 있으며, JWT를 통해 사용자 인증을 관리합니다. 문제가 발생하면 백엔드 로그와 프론트엔드 콘솔을 확인하세요.</p>