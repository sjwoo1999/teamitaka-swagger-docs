// functions/index.js

//-------------------------------------
// (1) Firebase Functions v2 / Logger
//-------------------------------------
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

//-------------------------------------
// (2) 필수 라이브러리: Express, 미들웨어
//-------------------------------------
const express = require("express");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

//-------------------------------------
// (3) Firebase Admin (이미 config/firebase.js에서 초기화)
//-------------------------------------
const admin = require("./config/firebase");

//-------------------------------------
// (4) 라우팅 관련 코드
//-------------------------------------
const authRoutes = require("./routes/authRoutes.js");
const authenticateJWT = require("./middleware/authenticateFirebase.js");

//-------------------------------------
// (5) Express 앱 초기화
//-------------------------------------
const app = express();

/*
 (6) 환경 변수 설정 (v2에서 functions.config() 미지원)
 - process.env.CLIENT_URL 또는 기본값 "https://teamitaka-swagger-practice.web.app"
 - process.env.PORT는 8080이 기본값이지만, 2nd Gen Functions에선 직접 listen 안 함
*/
const CLIENT_URL = process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app";
const PORT = process.env.PORT || 8080; // 실제 사용은 Optional

/*
 (7) Swagger 문서 로드
 - 기존 로직 그대로 유지
*/
const swaggerFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

//-------------------------------------
// (8) 미들웨어 설정
//-------------------------------------
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// csrf 미들웨어(토큰 발급)
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: "strict" } }));

//-------------------------------------
// (9) 루트 라우트 (2nd Gen Health Check)
//-------------------------------------
app.get("/", (req, res) => {
  // Cloud Run이 / 경로를 헬스체크로 호출하므로, 200 OK 반환
  res.status(200).send("OK");
});

//-------------------------------------
// (10) CSRF 토큰 발급
//-------------------------------------
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//-------------------------------------
// (11) 로그인 엔드포인트 (Firebase Auth 기반)
//-------------------------------------
app.post("/auth/login", async (req, res) => {
  const { idToken } = req.body;
  try {
    // 이미 초기화된 admin 객체 사용
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ message: "로그인 성공", token: idToken });
  } catch (error) {
    res.status(401).json({ message: "로그인 실패", error: error.message });
  }
});

//-------------------------------------
// (12) Swagger 문서 보호
//-------------------------------------
app.use("/api-docs", authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

//-------------------------------------
// (13) 기타 라우트
//-------------------------------------
app.use("/auth", authRoutes);

app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

//-------------------------------------

// (14) Firebase Functions 내보내기 (v2)

//-------------------------------------
exports.api = onRequest({ timeoutSeconds: 120 }, app);

exports.helloWorld = onRequest({ timeoutSeconds: 120 }, (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});
