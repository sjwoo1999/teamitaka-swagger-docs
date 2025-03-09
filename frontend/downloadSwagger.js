const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  storageBucket: 'teamitaka-swagger-practice.firebasestorage.app'
});

const bucket = admin.storage().bucket();
const file = bucket.file('swagger.yaml');

file.download({ destination: 'swagger.yaml' })
  .then(() => {
    console.log('swagger.yaml downloaded successfully');
  })
  .catch(err => {
    console.error('Error downloading swagger.yaml:', err);
    process.exit(1);
  });