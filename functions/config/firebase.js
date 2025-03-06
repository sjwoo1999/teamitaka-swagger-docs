// functions/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

// serviceAccountKey.json을 직접 로드해 인증 (개발 환경)
// 만약 프로덕션에서 Application Default Credentials를 쓰고 싶다면, 조건 분기도 가능
const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL, etc. 필요한 옵션 있으면 넣으세요
  });
  console.log("Firebase Admin: Default app initialized");
} else {
  console.log("Firebase Admin: Using existing default app");
}

module.exports = admin;
