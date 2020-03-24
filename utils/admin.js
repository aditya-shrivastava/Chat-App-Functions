const admin = require('firebase-admin');
var serviceAcount = require('./native-chat-app-43424-firebase-adminsdk-88hhf-2b1c38173c.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAcount),
	databaseURL: 'https://native-chat-app-43424.firebaseio.com',
});

const db = admin.firestore();

module.exports = { admin, db };