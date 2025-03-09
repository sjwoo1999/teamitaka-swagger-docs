const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// 로그인 엔드포인트
router.post('/login', login);

module.exports = router;