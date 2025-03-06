const cors = require('cors');

// 환경 변수에서 클라이언트 URL을 가져옴 (기본값은 개발 환경용)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

module.exports = cors({
  // 환경 변수를 통해 허용된 출처를 동적으로 설정
  origin: CLIENT_URL,
  credentials: true, // 인증 정보(쿠키 등)를 포함한 요청 허용
  methods: ['GET', 'POST', 'OPTIONS'], // 허용된 HTTP 메서드
});