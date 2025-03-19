const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://login-form-6b5fd.firebaseio.com" 
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const collection = 'users';

app.post('/create', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data:', data);
    
    const docRef = await db.collection(collection).add(data);
    res.status(201).json({message: 'User created successfully', id: docRef.id});
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({error: error.message});
  }
});

// Add a simple GET route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});