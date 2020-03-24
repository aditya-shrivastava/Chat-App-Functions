const admin = require('firebase-admin');
var serviceAcount = require('path to json file');

admin.initializeApp({
	credential: admin.credential.cert(serviceAcount),
	databaseURL: 'database url',
});

const db = admin.firestore();

module.exports = { admin, db };
