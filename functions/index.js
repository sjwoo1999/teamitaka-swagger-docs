require('dotenv').config();
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const admin = require("./config/firebase");
const authRoutes = require("./routes/authRoutes.js");
const authenticateJWT = require("./middleware/authenticateFirebase.js");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app";

let swaggerDocument;
try {
  const swaggerFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
  swaggerDocument = yaml.parse(swaggerFile);
} catch (error) {
  logger.error("Swagger YAML 파일 로드 또는 파싱 실패: ", error);
  swaggerDocument = { error: "Swagger 문서 로드 실패" };
}

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// CSRF 보호 제거
// const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: "lax" } });
// app.get("/csrf-token", (req, res) => { ... });
// app.use(csrfProtection);

// 기본 경로
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// 라우트 설정
app.use("/api/auth", authRoutes);

app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

exports.api = onRequest({ region: 'us-central1', timeoutSeconds: 120 }, app);

exports.helloworld = functions.https.onRequest({ region: 'us-central1', timeoutSeconds: 120 }, (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});