const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();
const port = 3000;

// MongoDB connection URI (replace with your connection string)
const mongoURI = 'mongodb://localhost:27017/myDatabase'; // Use your MongoDB URI

// Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// Define a Mongoose Schema and Model for accounts
const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Passwords should be hashed in production
});

const Account = mongoose.model('Account', accountSchema);

// Middleware to parse JSON data in requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to create a new account
app.post('/createAccount', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the account already exists
        const existingAccount = await Account.findOne({ $or: [{ username }, { email }] });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists.' });
        }

        // Create a new account
        const newAccount = new Account({ username, email, password }); // Hash password in production
        await newAccount.save();

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// API endpoint to retrieve all accounts (for testing or admin purposes)
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
