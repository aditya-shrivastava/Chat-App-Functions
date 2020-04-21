// Import node packages
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Import db 
const { db } = require('./utils/admin');

// Import user functions
const { signIn, getUsers } = require('./handlers/users');

// Import chat functions
const { getMessages, sendMessage, sendMedia, getNewMessages } = require('./handlers/messages');

const app = express();
app.use(cors());

// User Routes
app.post('/signin', signIn);
app.get('/users', getUsers);

// Message Routes
app.get('/messages', getMessages);
app.post('/message', sendMessage);
app.post('/media', sendMedia);
app.get('/new', getNewMessages);

exports.api = functions.region('asia-east2').https.onRequest(app);