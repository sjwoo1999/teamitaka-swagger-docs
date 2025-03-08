require('dotenv').config();
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');

const express = require("express");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const admin = require("./config/firebase");
const authRoutes = require("./routes/authRoutes.js");
const authenticateJWT = require("./middleware/authenticateFirebase.js");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "https://teamitaka-swagger-practice.web.app";
const PORT = process.env.PORT || 8080;

const swaggerFile = fs.readFileSync(path.join(__dirname, "swagger.yaml"), "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// CSRF 미들웨어 정의
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: "none" } });

// CSRF 보호가 필요 없는 경로
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/auth/login', (req, res) => {
  const { idToken } = req.body;
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      res.status(200).json({ message: '로그인 성공', uid: decodedToken.uid });
    })
    .catch((error) => {
      res.status(401).json({ message: '로그인 실패', error: error.message });
    });
});

// CSRF 보호 적용
app.use(csrfProtection);

app.use("/api-docs", authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api-docs/swagger.json", authenticateJWT, (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.use("/auth", authRoutes);

app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

exports.api = onRequest({ region: 'us-central1', timeoutSeconds: 120 }, app);

exports.helloworld = functions.https.onRequest({region: 'us-central1', timeoutSeconds: 120}, (req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});