// functions/index.js
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
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: "strict" } }));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/auth/login', (req, res) => {
  const { idToken } = req.body;
  const csrfToken = req.headers['x-csrf-token'];
  if (!csrfToken || csrfToken !== req.csrfToken()) {
      return res.status(403).json({ message: 'CSRF 토큰 불일치' });
  }
  // 나머지 로직
});

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
})