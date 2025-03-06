const functions = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

// 기존 middleware와 routes 파일이 src에 있다고 가정
const authRoutes = require("../src/routes/authRoutes.js");
const authenticateJWT = require("../src/middleware/authenticateFirebase.js");

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(cors({
  origin: process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app", // 환경 변수로 클라이언트 URL 설정
  credentials: true, // 인증 정보 포함 허용
}));
app.use(cookieParser());
app.use(csrf({ cookie: true })); // CSRF 보호 활성화

// 라우트 설정
app.use("/auth", authRoutes); // 인증 관련 라우트
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route"); // JWT 인증 필요
});

// CSRF 토큰 발급 엔드포인트
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // 클라이언트에 CSRF 토큰 제공
});

// Firebase Functions에 Express 앱 연결 (타임아웃 120초 설정)
exports.api = functions
  .runWith({ timeoutSeconds: 120 }) // 타임아웃 120초, 필요 시 memory: "512MiB" 추가 가능
  .onRequest(app);

// 기존 helloWorld 함수 유지 (타임아웃 120초 설정)
exports.helloWorld = functions
  .runWith({ timeoutSeconds: 120 }) // 타임아웃 120초
  .onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true }); // 구조화된 로그 기록
    response.send("Hello from Firebase!");
  });