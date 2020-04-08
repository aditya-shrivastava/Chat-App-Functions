const functions = require('firebase-functions');
const firebase = require('firebase');
const firebaseConfig = require('../utils/firebaseConfig');
const { db, admin } = require('../utils/admin');

// initialize firebase
firebase.initializeApp(firebaseConfig);

// Store user credentials in database
exports.signIn = (req, res) => {
	// create user object
	const uid = req.body.uid;
	const user = {
		name: req.body.displayName,
		email: req.body.email,
		photoURL: req.body.photoURL,
		uid
	}
	// console.log(req.body);
	// check if user already exists in database
	// if not then add the credentials
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

// fetch all users present in database
exports.getUsers = (req, res) => {
	// create list of users and return it
	let users = [];
	db.collection('/users').get()
		.then(data => {
			data.forEach(doc => {
				let user = {
					name: doc.data().name,
					photoURL: doc.data().photoURL
				}
				users.push(user);
			})
			return res.status(200).json(users);
		})
		.catch(err => {
			return res.status(500).json({ error: err.code })
		})
}