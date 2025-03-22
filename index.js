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

const blogPosts =[{
    paragraphs:["Hello my friend!", "Awesome stuff you have here!"],
    title:"A warm welcome!",
    author:"Jim Martinez",
    authorNote:"Jim the man is a big man who enjoys big manly endeavors."
},{
    paragraphs:["Everybody gets one."],
    title:"Spider-Man",
    author:"Jymothy Greene",
    authorNote:"Jymothy is so cool"
},
{
    paragraphs:["It’s been almost six years since the release of Fire Emblem Three Houses. Seven since the release of the last 3DS game, Fire Emblem Revelations. What was once an IP on the fringe of certain death, was saved by the glorious display that was Fire Emblem Awakening on the 3DS. Fire Emblem Awakening not only saved the Fire Emblem IP from being gone for good, but it completely revitalized the series, and several games have been made since Awakening.", "            What about Fire Emblem Awakening was SO enticing to masses that wasn't there before? Was it the support system? The engrossing story? Or, perhaps, the lucrative Lunatic+ difficulty that made the game impossibly hard?","            The answer is actually  <s>the dating simulator.</s> convoluted, and subjective at best. However, I propose that it was the sense of creation you got in the game. The sense of creation that you got through your supports, and the child units that you create.", "            While child units were already implemented in a previous game in the series, Genealogy of the Holy War, this game was never released outside of Japan. It’s a shame really; the mechanic works very similarly to how it works in Awakening, in that units will love each other and make children each generation. The children inherit stats, and you can mix and match units to have different parents for replayability.","            The mechanic already existing in a previous game may defeat my argument, but it’s important to keep in mind that innovation in Fire Emblem does not get much more intense than that in for a while. After the Holy War, which was the 4th game in the series, the next 8 games have virtually no innovation. This is a crass statement, and it should be noted as such, but there’s a parallel I am trying to make: Fire Emblem and Pokemon.","Bear with me.", "            Another IP that has been so formulaic in its presentation, Pokemon has shown tremendous revitalization with the newer games selling like hotcakes, and even VGC becoming insanely popular. The newer games are rampant with new mechanics, such as Dynamax, mega evolution, Z-moves, and the terastal effect. Pokemon games are more than getting your gym badges and completing the pokedex; the game is about mastering a new aspect of the series.",
        "	        Going back to Fire Emblem, while the child units were not new, the pair up system that Awakening carefully developed was insanely memorable. It allowed new strategies and even MORE replayability by pairing up different units. It was easy to cheese the pair up system and make unkillable behemoths, but that’s just more fun if you ask me. It can even be considered equal to the newer mechanics that the Fire Emblem series has explored, such as gambits in FE Three Houses or the Engage system in FE Engage.", "            By looking at these 2 IP’s and noticing what makes Nintendo successful, their core philosophy of always innovating seems to ring true for what makes a game good. Still, I always wonder why games don't COMPOUND their innovation. Dynamax is gone and out the window for Pokemon, and the engage system is highly likely to never return. All of these wonderful mechanics we all come to love may be briefly welcomed in reality."
     ],
    title:"Nintendo’s Core Philosophy Explored: Studying Pokemon and Fire Emblem",
    author:"Sammy Martinez",
    authorNote:"Sammy Martinez is a CS graduate who loves to spend his free time playing tennis, playing video games, listening to music, and drinking coffee."
}];

// Connect to MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true, //just use
        useUnifiedTopology: true,//use for deprecated connection methods
    })
 
    .then(() => {//normally, you can clarify whether a then block is onFailure or onSuccess. This case is binary, so no need to clarify.
        console.log('Connected to MongoDB');
    })
   
    .catch((err) => {//this is catching an error
        console.error('Failed to connect to MongoDB', err);
    });

// Define a Mongoose Schema and Model for accounts
const accountSchema = new mongoose.Schema({ //creating a mongoose schema, which is NO SQL and is just JSON
    username: { type: String, required: true, unique: true }, //
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Passwords should be hashed in production
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" } // Default role is "user"
    //Each acc requires: a unique username and email, and a password. (No need for unique password)
});


const Account = mongoose.model('Account', accountSchema);
module.exports = { Account }; //allows Account object to be used elsewhere

const blogSchema = new mongoose.Schema({
    paragraphs: {type: [String], required: true},
    title: {type: String, required: true, unique: true},
    author:{type: String, required: true},
    authorNote:{type: String, required: true}
});
const BlogPost = mongoose.model("BlogPost", blogSchema);//Change from the hardcoded blogPosts to this (app.get loadBlogPosts)
const reviewBlogs = mongoose.model("BlogPost", blogSchema);
async function addReviewBlogPost(data)//given the data, add a blogPost to a blog Model
{
    console.log("Paragraphs: ", data.paragraphs, "Title ", data.title, "AuthorName " , data.author, "AuthorNote " , data.authorNote);
    try {
       
        const newBlog = new reviewBlogs({ 
            paragraphs: data.paragraphs, 
            title: data.title, 
            author: data.author, 
            authorNote: data.authorNote
        });

        await newBlog.save(); // Save to the database
        return { success: true, message: "Blog post added for review." };
    } catch (error) {
        console.error("Error adding review blog post:", error);
        throw new Error("Failed to add blog post for review.");
    }
}
async function addNewBlogPost(data)
{
    try{
        console.log("Paragraphs PASSED IN: ", data.paragraphs, "Title ", data.title, "AuthorName " , data.author, "AuthorNote " , data.authorNote);

        const newBlog = new BlogPost({
            paragraphs: data.paragraphs,
            title: data.title,
            author: data.author,
            authorNote: data.authorNote
        });
        await newBlog.save();
        return{success: true, message: "Blog post added to the full database."};
    }
        catch(error){
            console.error("Error adding a blog to the database.", error);
            throw new Error("Failed to add blog post to database.");
        }
}

const reviewChecker = {
    paragraphs: ["hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"],
    title: "ggggggggggggggggggggggggggggggggggggggggggggggggg",
    author: "Heracross" ,
    authorNote: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
}
addReviewBlogPost(reviewChecker);
app.use(express.json());

//Finds an account with the username given, sets the role to Owner
async function promoteToOwner(username) {
    const result = await Account.findOneAndUpdate(
        { username: username }, 
        { $set: { role: "owner" } }, 
        { new: true } // Returns the updated document
    );

    if (result) {
        console.log(`User ${username} has been promoted to Owner.`);
    } else {
        console.log("User not found.");
    }
}

//Finds an account with the username given, sets the role to Admin
async function promoteToAdmin(username){
    const result = await Account.findOneAndUpdate(
        {username: username},
        { $set: {role: "admin"}},
        {new: true}
    );
    if(result){
        console.log(`User ${username} has been promoted to Admin.`);
    }
}

promoteToOwner("Heracross");

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve the index.html
//request: HTTP request made by client
//response: HTTP response that you will return server side
//res.send(): Sends a plain-text response.
//res.json(): Sends a JSON response.
//res.sendFile(): Sends a file as the response
//res.status(): Sets the HTTP status code for the response.
//This function routes HTTP GET requests at the root folder /, can change location for different requests
//this function sends a response by sending the index.html file
//A get request is a message from a client, server should respond to this request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//GET request that loads the BlogPosts from the server
//returns in json format the blogPosts stored in the Mongoose model 

//app.get('/loadBlogPosts', async(req,res)=>{
  //  console.log("Received request for blog posts");
   // console.log("Sending:", blogPosts);
  //  res.json(blogPosts);
//});

app.get('/loadReviewBlogPosts', async (req, res) => {
    console.log("Received request for Review Blog Posts.");
    
    try {
        const reviewBlogPosts = await reviewBlogs.find(); // Fetch data from DB
        console.log("Sending:", reviewBlogPosts);

        res.json(reviewBlogPosts || []); // Ensure an empty array is returned if no data
    } catch (error) {
        console.error("Error fetching review blog posts:", error);
        res.status(500).json({ message: "Internal server error." }); // Return a valid JSON error response
    }
});
app.get('/loadBlogPosts', async (req, res) => {
    console.log("Received request for Blog Posts.");
    
    try {
        const BlogPosts = await BlogPost.find(); // Fetch data from DB
        console.log("Sending:", BlogPosts);

        res.json(BlogPosts|| []); // Ensure an empty array is returned if no data
    } catch (error) {
        console.error("Error fetching review blog posts:", error);
        res.status(500).json({ message: "Internal server error." }); // Return a valid JSON error response
    }
});
// API endpoint to create a new account
//A GET request will request information from the server to a client
//A POST request will send information to the server, from the client

//Can use fetch() method which can process a POST request at a certain URL

//POST request that loads the account requested. POST request used for password Authentification
app.post('/confirmPendingBlog', async(req,res) =>{//PUT ON REVIEW
    //logging shows that the body is: author, authorNote, paragraphs, title
    console.log(req.body);
    const {paragraphs, title, author, authorNote} = req.body;
    try{
        data = {paragraphs, title, author, authorNote};
        await addReviewBlogPost(data);
        res.status(201).json({ message: "Blog post submitted for review successfully." });

    }
    catch(error)
    {
        console.error('Error posting blog under review:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }

})
app.post('/postNewBlog', async(req,res)=>{ //CONFIRMING
    console.log(req.body);
    const {paragraphs, title, author, authorNote} = req.body;
    try{
        data = {paragraphs, title, author, authorNote};
        await addNewBlogPost(data);//addReviewBlogPost
        res.status(201).json({message: "Blog post submitted to database."});
    }
    catch(error)
    {
        console.error("Error posting blog under review: ", error);
        res.status(500).json({message: "Internal server error."});
    }

})
app.post('/removeBlogFromReview', async(req,res)=>{
    console.log(req.body);
    const {paragraphs, title, author, authorNote} = req.body;
    data = {paragraphs, title, author, authorNote};
    const removedBlog = await reviewBlogs({title});
    if(removedBlog == data)
    {
        console.log("Set to remove.");
    }
})
app.post('/loadAccount', async(req,res) =>{
    //req.body used mostly in POST
    //req.query takes results from the url for GET
    const {username, password} = req.body;
    enteredPassword = req.body.password;

    try{
        //const existingAccount = await Account.findOne({$and : [{username},{password}]});
        const user = await Account.findOne({ username });
        
        if(user && enteredPassword == user.password){
            
            console.log("Stored password:", user.password);
            console.log("Loading account Successfully!");
          
            const { _id, username: uname, email, role } = user
            
            console.log(user.username, " " , user.email, " ", user.role, " MR MEESEEKSers");
            res.json({ username: uname, email, role }); //the response.json is the username and email
            
         //   const { _id, username: uname, email } = user
            
         //   console.log(user.username, " " , user.email, " MR MEESEEKSers");
          //  res.json({ username: uname, email });
            //return res.status(200).json(user);
        }
        else{
            console.log("Unable to load the account!");
            return res.status(401).json({message: 'Unauthorized'})
        }
    }
    catch(error)
    {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
//POST request, creates Account with req.body being username, email, password
app.post('/createAccount', async (req, res) => {
    const { username, email, password } = req.body;


    try {
        // Check if the account already exists
        // $and or $or
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

