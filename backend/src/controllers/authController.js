const auth = require('../config/firebase');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase로 사용자 확인 (이메일 기반)
    const userRecord = await auth.getUserByEmail(email);
    
    // 비밀번호 검증은 클라이언트 측 Firebase SDK에서 처리하므로, 여기서는 UID만 반환
    res.status(200).json({ message: '로그인 성공', uid: userRecord.uid });
  } catch (error) {
    res.status(401).json({ message: '로그인 실패', error: error.message });
  }
};

module.exports = { login };