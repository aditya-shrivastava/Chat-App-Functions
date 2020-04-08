const firebase = require('firebase');
const { db, admin } = require('../utils/admin');

// fetch all the messages
exports.getMessages = (req, res) => {
	// create a list of messages after fetching it from database and return it
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
};

// send a message
exports.sendMessage = (req, res) => {
	// create new message
	const newMessage = {
		body: req.body.body,
		userName: req.body.userName,
		uid: req.body.senderId,
		sent: new Date().toISOString()
	}

	// add the message to messages collection and return the result
	db.collection('messages')
		.add(newMessage)
		.then(doc => {
			const resMessage = newMessage;
			resMessage.messageId = doc.id;
			return res.json({ resMessage });
		})
		.catch(err => {
			return res.status(500).json({ error: 'Something went wrong' });
		});
};