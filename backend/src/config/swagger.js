const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

let swaggerDocument;
try {
    const swaggerFile = fs.readFileSync(path.join(__dirname, '../../swagger.yaml'), 'utf8');
    swaggerDocument = yaml.parse(swaggerFile);
} catch (error) {
    console.error('Swagger 파일 로드 실패:', error.message);
    process.exit(1);
}
module.exports = swaggerDocument;