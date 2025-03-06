// functions/middleware/authenticateFirebase.js
const admin = require('../config/firebase');

const authenticateFirebase = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // 검증된 사용자 정보를 요청 객체에 추가
    next();
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = authenticateFirebase;
