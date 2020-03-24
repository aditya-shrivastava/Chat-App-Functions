// Import node packages
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Import db 
const { db } = require('./utils/admin');

// Import user functions
const { helloWorld } = require('./handlers/users');

const app = express();
app.use(cors());

// User Routes
app.get('/signin', helloWorld);


exports.api = functions.region('asia-east2').https.onRequest(app);