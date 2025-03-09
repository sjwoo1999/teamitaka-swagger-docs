const admin = require('../config/firebase');

const login = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: '유효한 인증 토큰이 필요합니다.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Firebase Admin SDK로 idToken 검증
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 사용자 정보 확인 (선택적)
    const userRecord = await admin.auth().getUser(uid);

    res.status(200).json({ message: '로그인 성공', uid: userRecord.uid });
  } catch (error) {
    console.error('로그인 실패:', error);
    res.status(401).json({ message: '로그인 실패', error: error.message });
  }
};

module.exports = { login };