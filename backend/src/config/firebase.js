const admin = require('firebase-admin');

// GOOGLE_APPLICATION_CREDENTIALS 환경 변수에서 파일 경로 읽기
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '../../serviceAccountKey.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.auth();