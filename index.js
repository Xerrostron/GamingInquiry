//Encrypt a password with bycrypt instead of plain text queries of a password
//encrypt the user entered password to confirm a correct login

const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();
const port = 3000;

// MongoDB connection URI (replace with your connection string)
// Connection URL
//const mongoURI = 'mongodb://localhost:27017/myDatabase'; // Use your MongoDB URI
const mongoURI = "mongodb://0.0.0.0:27017/";

// Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true, //just use
        useUnifiedTopology: true,//use for deprecated connection methods
    })
    //Another way to write:
    //const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => {//normally, you can clarify whether a then block is onFailure or onSuccess. This case is binary, so no need to clarify.
        console.log('Connected to MongoDB');
    })
    //rather than a promise, can do:
    //await mongoURI.connect()
    .catch((err) => {//this is catching an error
        console.error('Failed to connect to MongoDB', err);
    });

// Define a Mongoose Schema and Model for accounts
const accountSchema = new mongoose.Schema({ //creating a mongoose schema, which is NO SQL and is just JSON
    username: { type: String, required: true, unique: true }, //
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Passwords should be hashed in production
    //Each acc requires: a unique username and email, and a password. (No need for unique password)
});
//what is a model and what is a schema?
//The model is actual object in which i will interact with. A schema can be reused on different objects. 
const Account = mongoose.model('Account', accountSchema);
module.exports = { Account }; //allows Account object to be used elsewhere
// Middleware to parse JSON data in requests
app.use(express.json());


// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve the index.html
//request: HTTP request made by client
//response: HTTP response that you will return server side
//res.send(): Sends a plain-text response.
//res.json(): Sends a JSON response.
//res.sendFile(): Sends a file as the response, like in your code.
//res.status(): Sets the HTTP status code for the response.
//This function routes HTTP GET requests at the root folder /, can change location for different requests
//this function sends a response by sending the index.html file
//A get request is a message from a client, server should respond to this request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to create a new account
//A GET request will request information from the server to a client
//A POST request will send information to the server, from the client
//this attemps to send information (req.body) and create and Account. this is called at the createAccount url 
//HOWEVER, i dont yet have a createAccount url. createAccount logic is handled in a function attached to a button.
//fix!
//Can use fetch() method which can process a POST request at a certain URL

//mongod in terminal to run the server 
app.post('/loadAccount', async(req,res) =>{
    //req.body used mostly in POST
    //req.query takes results from the url for GET
    const {username, password} = req.body;
//passwords can share a password, but not a username/email
//this should probably be a GET request since i am reading, not writing
//This logic is wrong though. POST Is prefferd method of user login
//what information am I loading?
    try{
        //const existingAccount = await Account.findOne({$and : [{username},{password}]});
        const user = await Account.findOne({ username });
        if(user){
            const { _id, username: uname, email } = user
            console.log(user.username, " " , user.email, " MR MEESEEKS");
            res.json({ username: uname, email });
            //return res.status(200).json(user);
        }
        else{
            return res.status(401).json({message: 'Unauthorized'})
        }
    }
    catch(error)
    {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.post('/createAccount', async (req, res) => {
    const { username, email, password } = req.body;


    try {
        // Check if the account already exists
        //
        const existingAccount = await Account.findOne({ $or: [{ username }, { email }] });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists.' });//400 means server cant follow request..
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
//intalled mongoDB and added to path
//mkdir /data or something like that to store my data. now the server is running

