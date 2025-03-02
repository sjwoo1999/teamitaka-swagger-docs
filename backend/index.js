const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs'); // fs 모듈 불러오기
const yaml = require('yaml'); // yaml 모듈 불러오기

const app = express();

// CORS 설정
app.use(cors({ origin: 'http://localhost:3000' }));

// swagger.yaml 파일 읽기 및 파싱
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDefinition = yaml.parse(swaggerFile);

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition,
  apis: [], // yaml 파일을 사용하므로 apis는 비워둠
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('백엔드 서버가 실행 중입니다!');
});

// 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행 중`));
