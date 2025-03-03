const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 간단한 인증 로직 (실제로는 DB와 연동)
  if (email === 'admin@example.com' && password === 'password123') {
    try {
      const customToken = await admin.auth().createCustomToken(email);
      res.json({ token: customToken });
    } catch (error) {
      res.status(500).json({ message: '토큰 생성 실패', error: error.message });
    }
  } else {
    res.status(401).json({ message: '잘못된 자격 증명' });
  }
});

module.exports = router;