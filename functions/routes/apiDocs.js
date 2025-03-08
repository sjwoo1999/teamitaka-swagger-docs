const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../config/swagger');
const authenticateJWT = require('../middleware/authenticateFirebase');

// Swagger UI 제공
router.use('/', authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Swagger JSON 제공
router.get('/swagger.json', authenticateJWT, (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  } catch (error) {
    console.error('Swagger JSON 제공 중 오류:', error);
    res.status(500).send({ error: 'Swagger 문서를 생성하지 못했습니다.' });
  }
});

module.exports = router;