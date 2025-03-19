const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

const app = express();

// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccountKey.json'); // Local development
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://login-form-6b5fd.firebaseio.com"
});

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (index.html and assets)
app.use(express.static(path.join(__dirname)));

// Routes
const collection = 'users';

// API Route: Create a User
app.post('/api/create', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data:', data);

    const docRef = await db.collection(collection).add(data);
    res.status(201).json({ message: 'User created successfully', id: docRef.id });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({ error: error.message });
  }
});

// Debugging Route
app.get('/api/create', (req, res) => {
  res.send('This is a GET request to /api/create. Use POST to create a user.');
});

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Export the app for Vercel (instead of using app.listen)
module.exports = app;
