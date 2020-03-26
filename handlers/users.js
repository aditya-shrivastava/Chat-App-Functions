const functions = require('firebase-functions');
const firebase = require('firebase');
const firebaseConfig = require('../utils/firebaseConfig');
const { db, admin } = require('../utils/admin');


firebase.initializeApp(firebaseConfig);

exports.signIn = (req, res) => {
	const uid = req.body.uid;
	const user = {
		name: req.body.displayName,
		email: req.body.email,
		photoURL: req.body.photoURL,
		uid
	}
	// console.log(req.body);
	db.doc(`/users/${uid}`)
		.get()
		.then(doc => {
			if (doc.exists) {
				return res.status(200).json({ message: 'User already registered' })
			} else {
				db.doc(`/users/${uid}`).set(user);
				return res.status(200).json({ message: 'User registered successfully' });
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ message: 'Something went wrong, please try again' });
		})
}