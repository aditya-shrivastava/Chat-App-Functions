const firebase = require('firebase');
const { db, admin } = require('../utils/admin');

// fetch all the messages
exports.getMessages = (req, res) => {
	db.collection('messages')
		.orderBy('sent')
		.get()
		.then(data => {
			let messages = [];
			data.forEach(doc => {
				messages.push({
					messageId: doc.id,
					body: doc.data().body,
					uid: doc.data().uid,
					userName: doc.data().userName,
				})
			})
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json({ error: err.code });
	})
}
