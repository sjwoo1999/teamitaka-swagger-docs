const admin = require('firebase-admin');

// 환경 변수 기반 초기화
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} else {
  // 로컬에서 기본 초기화 (Firebase CLI 인증 사용)
  admin.initializeApp();
}

module.exports = admin;