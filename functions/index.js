// functions/index.js

// (1) Firebase Functions v2 모듈
const functions = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// (2) Express 및 필요한 라이브러리
const express = require("express");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

// (3) 이미 config/firebase.js에서 초기화된 admin 객체 불러오기
const admin = require("./config/firebase");

// (4) 라우팅 관련 코드
const authRoutes = require("./routes/authRoutes.js");
const authenticateJWT = require("./middleware/authenticateFirebase.js");

// (5) Express 앱 초기화
const app = express();

/* 
  (6) 환경 변수 설정
  - 기존: const CLIENT_URL = functions.config().app.client_url || ...
          const PORT = functions.config().app.port || ...
  - 변경: process.env.CLIENT_URL (없으면 기본값)
          process.env.PORT (없으면 기본값)
*/
const CLIENT_URL = process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app";
const PORT = process.env.PORT || 8080;

/*
  (7) Swagger 문서 로드 
  - 기존 로직 그대로
*/
const swaggerFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

// (8) 미들웨어 설정
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: "strict" } }));

// (9) CSRF 토큰 발급
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// (10) 로그인 엔드포인트 (Firebase Auth 기반)
app.post("/auth/login", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ message: "로그인 성공", token: idToken });
  } catch (error) {
    res.status(401).json({ message: "로그인 실패", error: error.message });
  }
});

// (11) Swagger 문서 보호
app.use("/api-docs", authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// (12) 기타 라우트 설정
app.use("/auth", authRoutes);

app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

/*
  (13) Firebase Functions 내보내기
  - v2 style로 onRequest 사용
*/
exports.api = functions.onRequest({ timeoutSeconds: 120 }, app);

exports.helloWorld = functions.onRequest({ timeoutSeconds: 120 }, (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});
