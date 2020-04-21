const firebase = require('firebase');
const firebaseConfig = require('../utils/firebaseConfig');
const { db, admin } = require('../utils/admin');
const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

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
					type: doc.data().type,
					userName: doc.data().userName,
				})
			})
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json({ error: err.code });
		});
};

// fetch only the unread messages
exports.getNewMessages = (req, res) => {
	db.collection('messages')
		.where('read', '==', false)
		.get()
		.then(data => {
			let messages = [];
			data.forEach(doc => {
				messages.push({
					messageId: doc.id,
					body: doc.data().body,
					uid: doc.data().uid,
					type: doc.data().type,
					userName: doc.data().userName,
				})

				db.doc(`/messages/${doc.id}`).update({ read: true });
			})
			return res.status(200).json(messages);
		})
		.catch(err => {
			return res.status(500).json({ err: err.code });
		})
}

// send a message
exports.sendMessage = (req, res) => {
	// create new message
	const newMessage = {
		body: req.body.body,
		userName: req.body.userName,
		uid: req.body.senderId,
		type: req.body.type,
		sent: new Date().toISOString(),
		read: false
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

// upload media files
exports.sendMedia = (req, res) => {
	const busboy = new BusBoy({ headers: req.headers });

	let uploadData = null;
	let fileName;

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		
		ext = filename.split('.')[filename.split('.').length-1];
		fileName = `${Math.round(Math.random() * 1000000000000000)}.${ext}`;

		const filepath = path.join(os.tmpdir(), fileName);
		uploadData = { filepath, mimetype};
		file.pipe(fs.createWriteStream(filepath));
	});

	busboy.on('finish', () => {
		admin.storage()
			.bucket()
			.upload(uploadData.filepath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: uploadData.mimetype
					}
				}
			})
			.then(() => {
				const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/native-chat-app-43424.appspot.com/o/${fileName}?alt=media`;
				res.status(200).json({ mediaUrl });
			})
			.catch(err => {
				res.status(500).json({ err });
			})
	})

	busboy.end(req.rawBody);
}