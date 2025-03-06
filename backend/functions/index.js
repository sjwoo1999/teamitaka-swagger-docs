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

const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});

// 미들웨어 설정
app.use(cors({
  origin: process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app", // 요청된 출처 반영
  credentials: true,
}));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// 라우트 설정
app.use("/auth", authRoutes);
app.get("/protected", authenticateJWT, (/*req,*/ res) => {
  res.send("This is a protected route");
});

// CSRF 토큰 발급 엔드포인트
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Firebase Functions에 Express 앱 연결
exports.api = functions.onRequest(app);

// 기존 helloWorld 함수 유지
exports.helloWorld = functions.onRequest((/*request,*/ response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});