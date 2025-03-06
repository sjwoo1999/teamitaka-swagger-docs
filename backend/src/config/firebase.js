const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // Firebase 콘솔에서 다운로드한 키 파일 경로

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.auth();