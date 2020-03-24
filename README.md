# Firebase Cloud Functions 

## Create a utils folder:
### add admin.js:
```
const admin = require('firebase-admin');
var serviceAcount = require('path to json file');

admin.initializeApp({
	credential: admin.credential.cert(serviceAcount),
	databaseURL: 'database url',
});

const db = admin.firestore();

module.exports = { admin, db };
```

### add firebaseConfig.js:
add firebase config