const functions = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const authRoutes = require("./routes/authRoutes.js");
const authenticateJWT = require("./middleware/authenticateFirebase.js");

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Express 앱 초기화
const app = express();

// 환경 변수
const CLIENT_URL = functions.config().app.client_url || "https://teamitaka-swagger-practice.web.app";
const PORT = functions.config().app.port || 8080;

// Swagger 문서 로드
const swaggerFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

// 미들웨어 설정
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: "strict" } }));

// CSRF 토큰 발급
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 로그인 엔드포인트 (Firebase Auth 기반)
app.post("/auth/login", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ message: "로그인 성공", token: idToken });
  } catch (error) {
    res.status(401).json({ message: "로그인 실패", error: error.message });
  }
});

// 보호된 Swagger 문서 제공
app.use("/api-docs", authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// 라우트 설정
app.use("/auth", authRoutes);
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

// Firebase Functions 내보내기
exports.api = functions.onRequest({ timeoutSeconds: 120 }, app);

exports.helloWorld = functions.onRequest({ timeoutSeconds: 120 }, (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});