const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;
    if (username === 'aa' && password === 'password123') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.json({ message: '로그인 성공', token });
    } else {
        res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
    }
};

module.exports = { login };