const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../config/swagger');
const authenticateJWT = require('../middleware/authenticateJWT');

router.use('/', authenticateJWT, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;