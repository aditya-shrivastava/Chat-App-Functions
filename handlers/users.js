const functions = require('firebase-functions');
const firebase = require('firebase');
const firebaseConfig = require('../utils/firebaseConfig');
const { db, admin } = require('../utils/admin');


firebase.initializeApp(firebaseConfig);

exports.helloWorld = (req, res) => {
	return res.status(200).json({ message: 'Response from Server' });
}