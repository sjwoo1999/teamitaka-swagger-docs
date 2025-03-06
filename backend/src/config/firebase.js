const admin = require('firebase-admin');

// Base64 디코딩 후 JSON 파싱
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
if (!serviceAccountBase64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_B64 환경 변수가 설정되지 않았습니다.');
}

const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.auth();