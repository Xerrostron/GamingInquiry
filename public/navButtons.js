

/*Getting elements by class name returns an HTML collection this is Dynamic*/
/*alternative way to select: */
/*document.querySelectorAll(.navButton)* This is static*/
//const { Account } = require('./index');

//Need to load createButton on startup of the website if a user is currently logged in!
let blogPosts = []; // Use `let` so we can update it later

// Function to fetch blog posts from the server
async function fetchBlogPosts() {
    try {
        const response = await fetch('/loadBlogPosts'); // Adjust URL if needed
        if (!response.ok) throw new Error("Failed to fetch blog posts");
        
        blogPosts = await response.json(); // Store fetched data in the variable
        console.log("Fetched blog posts:", blogPosts); // Debugging: Log the fetched data
        return blogPosts; //this wasnt here before
    } catch (error) {
        console.error("Error fetching blog posts:", error);
    }
}

// Call the function to fetch blog posts
fetchBlogPosts();

const buttons = document.querySelectorAll(".navButton");
buttons.forEach(button => {
    button.addEventListener("click", function()
{
    const value = this.value;
    console.log(value);
    if(value==="About")
    {
        loadAboutPage();
    }
    if(value==="Browse")
    {
        loadBrowsePage();
    }
    if(value==="Home")
    {
        loadHomePage();
    }
    if(value==="User")
    {
        if(document.querySelector("#user_modal"))
        {
            console.log("Only  one modal box allowed at a time.");
        }
        else{
            loadUserLogin();
        }
    }
    
});
});
console.log("Is someone logged in function: " + isSomeoneLoggedIn());
    if(isSomeoneLoggedIn())
    {
        setCreateButton();
        setAccount();
        if(isSomeoneAnAdmin())
        {
            setReviewPanel();
        }
        if(isSomeoneAnOwner())
        {
            setOwnerPanel();
        }
    }
    else{
        console.log("Unknown value.");
    }

function isSomeoneAnOwner()
{
    const account = JSON.parse(localStorage.getItem("currentAccount"))
    console.log(account.role);
    if(account.role =="owner")
    {
        console.log("An Owner is logged in!");
        return true;
    }
}
function setOwnerPanel()
{
    console.log("I am set to OWN!");
    const ownerButton = document.createElement("button");
    ownerButton.setAttribute("class", "navButton");
    ownerButton.setAttribute("value", "Owner");
    ownerButton.setAttribute("type", "button");
    ownerButton.textContent="Owner";
    const listForReview = document.createElement("li");
    listForReview.setAttribute("class","pageTop");
    listForReview.setAttribute("id", "ownerButton");
    listForReview.append(ownerButton);
    const buttons = document.querySelector("#navButtonsList");
    buttons.append(listForReview);
    ownerButton.addEventListener("click", function(){

        console.log("Review button clicked");
        ownerButtonListenerProper();

    });

}
async function ownerButtonListenerProper()
{
    const contentDiv = document.querySelector(".blogPost");

    contentDiv.innerHTML = `
      <main>
         <h1>Owner Post Moderation:</h1>
     </main>
    `;

    const mainBlock = contentDiv.querySelector("main");

    function createPostElement(post) {
    // Create a wrapper div for each post
     const postContainer = document.createElement("div");
     postContainer.classList.add("post-container");
    
    // Create the button for the blog title
     const button = document.createElement("button");
     button.textContent = post.title;
     button.classList.add("blog-title");
    
    // Create accept and reject buttons as images
    const acceptButton = document.createElement("button");
    const rejectButton = document.createElement("button");
    acceptButton.setAttribute("class", "reviewAcceptance");
    acceptButton.setAttribute("id", "acceptanceButton");
    rejectButton.setAttribute("class", "reviewAcceptance");
    rejectButton.setAttribute("id", "rejectButton");
    
     
    const acceptImg = document.createElement("img");
    acceptImg.src = "acceptance.png";
    acceptImg.alt = "Accept";
    acceptImg.style.width = "20px"; // Adjust size if needed
    acceptImg.style.marginLeft = "5px";
 
    const rejectImg = document.createElement("img");
    rejectImg.src = "rejection.jpg";
    rejectImg.alt = "Reject";
    rejectImg.style.width = "20px"; // Adjust size if needed
    rejectImg.style.marginLeft = "5px";

    acceptButton.appendChild(acceptImg);
    rejectButton.appendChild(rejectImg);

    // Append the title button and the action images to the post container
     postContainer.appendChild(button);
     postContainer.appendChild(acceptButton);
     postContainer.appendChild(rejectButton);

    // Append the entire post container to the mainBlock
     mainBlock.appendChild(postContainer);
     // Attach event listeners to the correct blog post
    acceptButton.addEventListener("click", () => handleAccept(post));
    rejectButton.addEventListener("click", () => handleReject(post));
    }
    const reviewBlogPosts = await getReviewBlogPosts();
    console.log(reviewBlogPosts);
    console.log(Array.isArray(reviewBlogPosts));
    const BlogPosts = await fetchBlogPosts();
    console.log(BlogPosts);
    console.log(Array.isArray(BlogPosts));
// Loop through review posts
    reviewBlogPosts.forEach(createPostElement);

// Loop through regular blog posts
    BlogPosts.forEach(createPostElement);

}
function handleAccept(post)//I dont actually have any use for this atm. dont do anything. This is purely for my own ease
{
   
   console.log("Finish this logic another time or just dont use it. Mainly wanted this tab to delete stuff on the front-end.");

}
//This works: However, the list should be updated after each removal! Implement this, then apply to the review Tab
function handleReject(post)//Delete the post
{
   console.log("Post: " + post);
   deleteBlog(post);
   deleteBlogFromReview(post);
   ownerButtonListenerProper();
   //redo Owner Panel HTML
}
function deleteBlog(post) {
    return fetch('/removeBlog', {  // Ensure fetch is returned
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post),
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed Post Data:", post);
            throw new Error('Post Failed To Be Removed: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Post successfully removed:", data);
    })
    .catch(error => {
        console.error("Error removing post:", error);
    });
}
function deleteBlogFromReview(post) {
    return fetch('/removeBlogFromReview', {  // Ensure fetch is returned
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post),
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed Post Data:", post);
            throw new Error('Post Failed To Be Removed: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Post successfully removed:", data);
    })
    .catch(error => {
        console.error("Error removing post:", error);
    });
}
async function ownerButtonListener()
{
     //Await an asynchronous getRequest to use the data as an array (promise technicality)
     const reviewBlogPosts = await getReviewBlogPosts();
     console.log(reviewBlogPosts);
     console.log(Array.isArray(reviewBlogPosts));
     const BlogPosts = await fetchBlogPosts();
     console.log(BlogPosts);
     console.log(Array.isArray(BlogPosts));
     const contentDiv = document.querySelector(".blogPost");

     contentDiv.innerHTML = 
     `
     <main>
     <h1>Blog Posts Under Review: </h1>
     </main>
     `;
     //loadArticleTitlesRevised(); this method might not work because of scope with contentDiv
     const mainBlock = contentDiv.querySelector("main");
 
     reviewBlogPosts.forEach(post => {
         const button = document.createElement("button"); 
         button.textContent = post.title; 
         button.setAttribute("class", "blog-title");
         mainBlock.appendChild(button); 
        
         const acceptImg = document.createElement("img");
        acceptImg.src = "acceptance.png";
        acceptImg.alt = "Accept";
        acceptImg.style.width = "20px"; // Adjust size if needed
        acceptImg.style.marginLeft = "5px";
     
        const rejectImg = document.createElement("img");
        rejectImg.src = "rejection.jpg";
        rejectImg.alt = "Reject";
        rejectImg.style.width = "20px"; // Adjust size if needed
        rejectImg.style.marginLeft = "5px";
    
        mainBlock.appendChild(acceptImg);
        mainBlock.appendChild(rejectImg);
        mainBlock.appendChild(document.createElement("br"));
         //now have buttons: blog-title class name
         //const titleButtons = document.querySelectorAll(".blog-title");
         //titleButtonFunctionalityReview(titleButtons, reviewBlogPosts);
     });
     BlogPosts.forEach(post=>{
        const button = document.createElement("button");
        button.textContent = post.title;
        button.setAttribute("class", "blog-title");
        mainBlock.appendChild(button);
        const acceptImg = document.createElement("img");
        acceptImg.src = "acceptance.png";
        acceptImg.alt = "Accept";
        acceptImg.style.width = "20px"; // Adjust size if needed
        acceptImg.style.marginLeft = "5px";
     
        const rejectImg = document.createElement("img");
        rejectImg.src = "rejection.jpg";
        rejectImg.alt = "Reject";
        rejectImg.style.width = "20px"; // Adjust size if needed
        rejectImg.style.marginLeft = "5px";
    
        mainBlock.appendChild(acceptImg);
        mainBlock.appendChild(rejectImg);
        mainBlock.appendChild(document.createElement("br"));

     })
     
}
function setReviewPanel()
{
    console.log("I am set to review!");
    const reviewButton = document.createElement("button");
    reviewButton.setAttribute("class", "navButton");
    reviewButton.setAttribute("value", "Review");
    reviewButton.setAttribute("type", "button");
    reviewButton.textContent="Review";
    const listForReview = document.createElement("li");
    listForReview.setAttribute("class","pageTop");
    listForReview.setAttribute("id", "reviewButton");
    listForReview.append(reviewButton);
    const buttons = document.querySelector("#navButtonsList");
    buttons.append(listForReview);
    reviewButton.addEventListener("click", function(){

        console.log("Review button clicked");
        reviewButtonListener();

    });

    //reviewButtonListener();

}
async function reviewButtonListener()
{

       //Await an asynchronous getRequest to use the data as an array (promise technicality)
       const reviewBlogPosts = await getReviewBlogPosts();
       console.log(reviewBlogPosts);
       //not returning an array
       console.log(Array.isArray(reviewBlogPosts));
       const contentDiv = document.querySelector(".blogPost");

       contentDiv.innerHTML = 
       `
       <main>
       <h1>Blog Posts Under Review: </h1>
       </main>
       `;
       //loadArticleTitlesRevised(); this method might not work because of scope with contentDiv
       const mainBlock = contentDiv.querySelector("main");
   
       reviewBlogPosts.forEach(post => {
           const button = document.createElement("button"); 
           button.textContent = post.title; 
           button.setAttribute("class", "blog-title");
           mainBlock.appendChild(button); 
           mainBlock.appendChild(document.createElement("br"));
           //now have buttons: blog-title class name
           const titleButtons = document.querySelectorAll(".blog-title");
           titleButtonFunctionalityReview(titleButtons, reviewBlogPosts);
       });

       
   
}
function blogAcceptance(data)//passing in the object that i want to remove
{
    const contentDiv = document.querySelector(".blogPost");
    const acceptButton = document.createElement("button");
    const rejectButton = document.createElement("button");
    acceptButton.setAttribute("class", "reviewAcceptance");
    acceptButton.setAttribute("id", "acceptanceButton");
    rejectButton.setAttribute("class", "reviewAcceptance");
    rejectButton.setAttribute("id", "rejectButton");
    
     
    const acceptImg = document.createElement("img");
    acceptImg.src = "acceptance.png";
    acceptImg.alt = "Accept";
    acceptImg.style.width = "20px"; // Adjust size if needed
    acceptImg.style.marginLeft = "5px";
 
    const rejectImg = document.createElement("img");
    rejectImg.src = "rejection.jpg";
    rejectImg.alt = "Reject";
    rejectImg.style.width = "20px"; // Adjust size if needed
    rejectImg.style.marginLeft = "5px";

    acceptButton.appendChild(acceptImg);
    rejectButton.appendChild(rejectImg);
    console.log(data, "Data I am passing in for acceptance or rejection.");
    
    contentDiv.append(acceptButton);
    contentDiv.append(rejectButton);
    acceptButtonListener(data);
    rejectButtonListener(data);
}
function acceptButtonListener(data)
{//blog is not successfully being posted
    const acceptButton = document.querySelector("#acceptanceButton");
    console.log("Data being passed to /postNewBlog: " + data);
    acceptButton.addEventListener("click", function()
    {
        fetch('/postNewBlog', {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),//passing in username and password
        })
        //check if successful attempt
        .then(response => {
            if (!response.ok) {
                console.log(data.paragraphs);
                console.log(data.title);
                console.log(data.author);
                console.log(data.authorNote);
                throw new Error('Post Failed: ' + response.status);
            }
            else{
                deleteBlogFromReview(data);
                console.log("reviewButtonListenerActivated");
                reviewButtonListener();
                return response.json();
            }
            
        })
        .catch(error => {
            console.error("Error posting blog:", error);
        });
    });
    
}
function rejectButtonListener(data)
{
    console.log("reviewButtonListenerActivated REJECT");
    const rejectButton = document.querySelector("#rejectButton");
    rejectButton.addEventListener("click", function()
    {
        deleteBlogFromReview(data);
        reviewButtonListener();
    });
    
    
}
function removeReviewPost(data)
{

}
function titleButtonFunctionalityReview(titleButtons, reviewBlogPosts)
{
    titleButtons.forEach(titleButton=>{
        titleButton.addEventListener("click", function()
        {
            const titleButtonContent = titleButton.textContent;
            loadReviewBlogPost(titleButtonContent, reviewBlogPosts);

        });
    
    });
    
}
function loadReviewBlogPost(titleButtonContent, reviewBlogPosts)
{
    for(let i = 0; i<reviewBlogPosts.length; ++i)
        {
            if(titleButtonContent===reviewBlogPosts[i].title)
            {
                 //NOTE: innterHTML does NOT ACTIVATE A SCRIPT!
              const contentDiv = document.querySelector(".blogPost");
              const data = reviewBlogPosts[i];
              console.log(data);
              contentDiv.innerHTML = 
                `
                <main>
               </main>
                `;
                //blog format
               //main, h1 (title), h2(authorName), p -> br(in loop)
               const mainBlock = contentDiv.querySelector("main");
               const header = document.createElement("h1");
               header.textContent = reviewBlogPosts[i].title;
               mainBlock.append(header);
               const authorBlock = document.createElement("div");
               authorBlock.setAttribute("class", "authorBox");
               const authorName = document.createElement("h2");
               authorName.textContent = "By: " + reviewBlogPosts[i].author;
               const authorNote = document.createElement("p");
               authorNote.textContent = reviewBlogPosts[i].authorNote;
               authorBlock.appendChild(authorName);
               authorBlock.appendChild(authorNote);
               mainBlock.append(authorBlock);
               mainBlock.append(document.createElement("br"));
               const paragraphs = processParagraphs(reviewBlogPosts[i]);
               //use J for an inner array
               for(let j = 0; j< paragraphs.length;++j)
               {
                    mainBlock.appendChild(paragraphs[j]);
                    mainBlock.appendChild(document.createElement("br"));
                    //append a button at the bottom of each paragraph.
    
               }
               blogAcceptance(data);//loads the buttons
            }
        }
}
//I am successfully getting the ReviewBlogPosts
async function getReviewBlogPosts() {
    try {
        const response = await fetch('/loadReviewBlogPosts');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Review Blog Posts:", data);
        return data; // Return the fetched data for further use
    } catch (error) {
        console.error('Error fetching review blog posts:', error);
        return null; // Return null in case of an error
    }
}

function isSomeoneAnAdmin()
{
    const account = JSON.parse(localStorage.getItem("currentAccount"))
    console.log(account.role);
    if(account.role =="owner" || account.role == "admin")
    {
        console.log("An admin/Owner is logged in!");
        return true;
    }
}
function loadHomePage()
{
    const contentDiv = document.querySelector(".blogPost");
    contentDiv.innerHTML =
     `
         <main>
         <h1>
            Click the Buttons to Navigate the Blog!
         </h1>
         <h>
            Browse
            <p>Browse blog posts and find something nice to read.</p>
         </h>
         <h>
            About
            <p>Read about the blog's history and purpose.</p>
         </h>
         <h>
            Home
            <p>Return back to this page.</p>
         </h>
        </main>
     `;
}
function loadUserLogin()
{
    //several input types: hidden, email, color, button, checkbox, file, date, datetime-local, radio, tel, search, range, url, week, password
  
    const contentDiv = document.querySelector(".blogPost");
    const testUserBox = document.querySelector("#user_modal");
    const loginBox = document.querySelector("#login_account_button")
    console.log("Inside loadUserLogin");
    // Clear the modal if it already exists
    //Setting innerHTML to "" is NOT a solution!
    if (testUserBox) {
        testUserBox.remove();
    }
   // if(loginBox)
   // {
   //     loginBox.innerHTML="";
    //}

    const userBox = document.createElement("div");
    userBox.setAttribute("id","user_modal");
    userBox.setAttribute("draggable","true");
    
    //observe the output before anything has been done
    //localStorage.clear();

    const account = localStorage.getItem('currentAccount');

    if (account) {
        console.log("Someone is logged in.");
        //setAccount();
        userBox.innerHTML = 
        `
               <label for="email_address">Email</label>
               <input type="email" class="modal_input" id="email_address" placeholder="Basic Email Format">
               <label for="text">Username</label>
               <input type="text" class="modal_input" id ="username" placeholder="4-12 chars, Alphanumeric">
               <label for="user_password">Password</label>
               <input type="password" class="modal_input" id="user_password" placeholder="8+ chars, 1 uppercase, 1 lowercase, 1 digit">
               <label for"password_check">Re-Type your Password</label>
               <input type="password" class="modal_input" id="user_password_re" placeholder="Retype the password entered.">
               <button class="modal_input" id="create_account_button" type="button" value="createAcc">Create Account</button>
               <p>Or...</p>
               <button class="modal_input" id="logout_account_button" type="button" value="logoutAcc">Logout</button>
               <button class="modal_input" id="exit_button" type="button" value="exit"><img src="exitButton.jpg" alt="exit Button"></button>
    
        `;
        contentDiv.append(userBox);
        const logoutButton = document.querySelector("#logout_account_button");
        logoutButton.addEventListener("click", function(){
            logoutAccountButton();
        });
        //setCreateButton();
    } else {
       
       console.log("No one is logged in.");
       userBox.innerHTML = 
       `
              <label for="email_address">Email</label>
              <input type="email" class="modal_input" id="email_address" placeholder="Basic Email Format">
              <label for="text">Username</label>
              <input type="text" class="modal_input" id ="username" placeholder="4-12 chars, Alphanumeric">
              <label for="user_password">Password</label>
              <input type="password" class="modal_input" id="user_password" placeholder="8+ chars, 1 uppercase, 1 lowercase, 1 digit">
              <label for"password_check">Re-Type your Password</label>
              <input type="password" class="modal_input" id="user_password_re" placeholder="Retype the password entered.">
              <button class="modal_input" id="create_account_button" type="button" value="createAcc">Create Account</button>
              <p>Or...</p>
              <button class="modal_input" id="login_account_button" type="button" value="loginAcc">Login</button>
              <button class="modal_input" id="exit_button" type="button" value="exit"><img src="exitButton.jpg" alt="exit Button"></button>
   
       `;
       contentDiv.append(userBox);
       const loadButton = document.querySelector("#login_account_button");
   
       loadButton.addEventListener("click",function()
       {
           loadAccountButton();
       });
    }

    
   
    //for a true pop-up, i need to NOT erase contentDiv. just find previous user_box and delete it
   // contentDiv.innerHTML ="";
    //CLEARS OUT PREVIOUS HTML
    
    //I should surround these functions inside an event listener
    const createButton = document.querySelector("#create_account_button");
    const exitButton = document.querySelector("#exit_button");
   
    exitButton.addEventListener("click", function()
    {
       // Looks correct but ISNT contentDiv.remove(userBox);
       //DIRECTLY remove:
       userBox.remove();
    });
    createButton.addEventListener("click", function()
    {
        createAccountButton();
    });

  
}
function clearLoginBox()
{
    //same logic as exit Button
    //If I choose to refactor, can just call this function for the exit button. As of now, I want to call for logging in and logging out
    const userBox = document.querySelector("#user_modal");
    userBox.remove();
}
function removeReviewButton()
{
    const reviewButton = document.querySelector("#reviewButton");
    reviewButton.remove();
}
function logoutAccountButton()
{
    localStorage.clear();
    emptyAccount();
    clearLoginBox();
    removeCreateButton();
    removeReviewButton();
    if(document.querySelector("#create_post_form") == null)
    {
        console.log("The creation HTML is non-existent.");
    }
    else{
        console.log("The creation HTML exists!");
        removeCreateBlogForm();
    }
}
function removeCreateBlogForm()
{
    const blogForm = document.querySelector("#create_post_form");
    blogForm.remove();
    const createLabels = document.querySelector(".create_labels");
    createLabels.remove();
    loadRemovedCreateForm();
}
function loadRemovedCreateForm()
{
    const contentDiv = document.querySelector(".blogPost");
    contentDiv.innerHTML = "";
    loadHomePage();
    //can go back to this approach for flavour later....disable interactivity if I choose this approach
    //loadHomePage() vs. loadHomePage
     //window.setTimeout(loadHomePage, 3000);
}
function createAccountButton()
{
    
        //get the elements based on ID of the specific labels, and get the values there
    //empty elements with no user input are "" NOT NULL
    let testUsername = document.querySelector("#username");
    console.log("testUsername: " + testUsername.value);

    let testEmail = document.querySelector("#email_address");
    console.log("testEmail: " + testEmail.value);
  
    let testPassword = document.querySelector("#user_password");
    console.log("testUserPassword: " + testPassword.value);

    let testPasswordRe = document.querySelector("#user_password_re");
    console.log("testPasswordRe: " + testPasswordRe.value);


  // Define regular expressions: Can look these up, don't worry about memorizing.
    const usernameRegex = /^[a-zA-Z0-9]{4,12}$/; // Alphanumeric, 4-12 characters
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/; // 8+ characters, 1 uppercase, 1 lowercase, 1 digit

   // Test the input values
    const isUsernameValid = usernameRegex.test(testUsername.value);
    const isEmailValid = emailRegex.test(testEmail.value);
    const isPasswordValid = passwordRegex.test(testPassword.value);
    const doPasswordsMatch = testPassword.value === testPasswordRe.value;

    // Log results or display messages
    console.log(`Username valid: ${isUsernameValid}`);
    console.log(`Email valid: ${isEmailValid}`);
    console.log(`Password valid: ${isPasswordValid}`);
    console.log(`Passwords match: ${doPasswordsMatch}`);
      if (isUsernameValid && isEmailValid && isPasswordValid && doPasswordsMatch) {
          //before I can confirm, check an Email tied to account that already exists!
          //alert("Account created successfully!");
          //Now it is time to validate the account
          
          const data = {
              username: testUsername.value,
              password: testPassword.value,
              email: testEmail.value
          };
          //JS most likely wont know what an account is. lets fetch with the data object
          validateAccount(data);
      } else {
          alert("Please correct the errors in your input.");
      }

    // Perform actions based on validation, Do not do this automatically. only run this code for button handler
   
}
function loadAccountButton()
{
    //add a previous button that just calls loadUserLogin()
    //reload HTML to a Login Page
    //this can be done by just setting contentDiv.innerHTML("");
    //JUST username and password
    const userBox = document.querySelector("#user_modal");
   // userBox.innerHTML = "";
    
    
    
    
        console.log("Changing HTML");
        userBox.innerHTML=
    `
        <label for="username">Username</label>
        <input type="text" class="modal_input" id ="username" placeholder="4-12 chars, Alphanumeric">
        <label for="user_password">Password</label>
        <input type="password" class="modal_input" id="user_password" placeholder="8+ chars, 1 uppercase, 1 lowercase, 1 digit">
        <button class="modal_input" id="Log-In" type="button">Login</button>
        <button class="modal_input" id="previous_button" type="button">Previous</button>
        <button class="modal_input" id="exit_button" type="button" value="exit"><img src="exitButton.jpg" alt="exit Button"></button>

    `;
        const previousButton = document.querySelector("#previous_button");
        previousButton.addEventListener("click", function()
        {
            console.log("loadUserLogin button clicked.");
            loadUserLogin();

        });
        const exitButton = document.querySelector("#exit_button");
        exitButton.addEventListener("click", function()
        {
            const contentDiv = document.querySelector(".blogPost");
            const userBox = document.querySelector("#user_modal");
            userBox.remove();
        });

        //Event listeners are called when a button is clicked. Therefore, only check for values when a button is clicked
        const loginButton = document.querySelector("#Log-In");
        loginButton.addEventListener("click", function()
         {
            const testUsername = document.querySelector("#username");
            console.log("testUsername: " + testUsername.value);
          
            const testPassword = document.querySelector("#user_password");
            console.log("testUserPassword: " + testPassword.value);
    
            const data = {
                username: testUsername.value,
                password: testPassword.value
            };
            if(data.username === "" || data.password === "")
            {
                const usernameField = document.querySelector("#username");
                usernameField.setAttribute("placeholder", "Please enter your username.");
                usernameField.style.color = "red";
                const passwordField = document.querySelector("#user_password");
                passwordField.setAttribute("placeholder", "Please enter your Password.");
                passwordField.style.color = "red";

            }
            else{
                validateLogin(data);
                console.log("Why am i here...");
            }
            
         });
       
  
        
 }

function validateLogin(data)
{   
    //response is the HTML object returned
    //result is the response parsed with response.json()
    //apparently, i am passing in nothing
    console.log(data.username + " data username");
    console.log(data.password + " data password");
    console.log("HELLO!!!!!!");
    fetch('/loadAccount', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),//passing in username and password
    })
    //check if successful attempt
    .then(response => {
        if (!response.ok) {
            console.log(response.body);
            console.log(data);
            console.log(data.username);
            console.log(data.password);
            throw new Error('Login failed: ' + response.status);
        }
        return response.json();
    })
    .then(account => {
        localStorage.setItem('currentAccount', JSON.stringify(account)); // Store in localStorage
        console.log('Logged in account:', account);
        alert('Login successful!');
        // Retrieve and use when needed
        const storedAccount = JSON.parse(localStorage.getItem('currentAccount'));
        console.log('Stored account:', storedAccount);
        setAccount();
        clearLoginBox();
        setCreateButton();
        setReviewPanel();
    })
    
}
//Adds a Create Button to Header when logged in
function setCreateButton() //dynamically adding a CreateButton
{
    console.log("I am set to create!");
    const createButton = document.createElement("button");
    createButton.setAttribute("class", "navButton");
    createButton.setAttribute("value", "Create");
    createButton.setAttribute("type", "button");
    createButton.textContent="Create";
    const listForCreate = document.createElement("li");
    listForCreate.setAttribute("class","pageTop");
    listForCreate.setAttribute("id", "createButton");
    listForCreate.append(createButton);
    const buttons = document.querySelector("#navButtonsList");
    buttons.append(listForCreate);
    createButtonListener();

}
function createButtonListener()
{
    const createButton = document.querySelector("#createButton");
    createButton.addEventListener("click", function()
    {
       const contentDiv = document.querySelector(".blogPost");
       contentDiv.innerHTML = "";

       //const blogPostForm = document.createElement("form");
       const blogPostForm = document.createElement("form");
       blogPostForm.setAttribute("id","create_post_form");

       const textArea = document.createElement("textArea");
       textArea.setAttribute("id","create_post");
       textArea.setAttribute("class", "postContent");
       textArea.setAttribute("rows", "12");
       textArea.setAttribute("columns", "15");
       textArea.setAttribute("placeholder", "900-4500 Characters");//is this correct
       blogPostForm.append(textArea);

       const postLabel = document.createElement("label");
       postLabel.setAttribute("type", "text");
       postLabel.setAttribute("id", "postLabel");
       postLabel.setAttribute("for", "create_post");
       postLabel.setAttribute("class", "create_labels");
       postLabel.textContent="Type the contents of your blog here. Separate paragraphs by pressing enter and starting on a newline!";
       textArea.addEventListener("keypress", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            textArea.value = textArea.value + "\n\n";            
            textArea.scrollTop = 99999;//dynamically adjusts the textArea to see the new line
        }
        });//overriding enter for a double space

        const titleForm = document.createElement("form");
        titleForm.setAttribute("id", "create_title_form");

        const titleArea = document.createElement("input");
        titleArea.setAttribute("class", "postContent");
        titleArea.setAttribute("type", "text");
        titleArea.setAttribute("id", "create_title");
        titleArea.setAttribute("placeholder","45-90 Characters");

        titleForm.append(titleArea);

        const titleLabel = document.createElement("label");
        titleLabel.setAttribute("class","create_labels");
        titleLabel.setAttribute("id", "titleLabel");
        titleLabel.setAttribute("for", "create_title");
        titleLabel.textContent = "Type the title of your post.";

        const submitButton = document.createElement("button");
        submitButton.setAttribute("id", "postSubmitButton");
        submitButton.textContent ="Submit post";

        const noteArea = document.createElement("input");
        noteArea.setAttribute("class", "postContent");
        noteArea.setAttribute("id", "create_note");
        noteArea.setAttribute("type", "text");
        noteArea.setAttribute("placeholder", "100-400 Characters");

        const noteLabel = document.createElement("label");
        noteLabel.setAttribute("class", "create_labels");
        noteLabel.setAttribute("for", "create_note");
        noteLabel.setAttribute("id", "noteLabel");
        noteLabel.textContent = "Create an Author's Note for your post.";

        


       contentDiv.append(titleLabel);
       contentDiv.append(titleForm);
       contentDiv.append(postLabel);
       contentDiv.append(blogPostForm);
       contentDiv.append(noteLabel);
       contentDiv.append(noteArea);

       submitButton.addEventListener("click", function()
       {
            submitPostButton();

       });
       contentDiv.append(document.createElement("br"));
       contentDiv.append(document.createElement("br"));

       contentDiv.append(submitButton);


    });
}
function submitPostButton()
{
    //for printing the contents of a class, may not be possible?
    //querySelectorAll returns a NodeList, need to make an array of elements from the NodeList that maps each element to the value inside that element
    //const data = document.querySelectorAll(".postContent");
    //console.log(data);

    //const data = Array.from(document.querySelectorAll(".postContent")).map(el => el.value);
    //alternate approach is to querySelector(#id) and then doing element.value for each element
    //IN fact, that approach is better for my current backend because my backend is expecting an object, not an array
    console.log("I clicked the submit button!");
    const data =  {
        title: document.querySelector("#create_title").value, //45-90
        post: document.querySelector("#create_post").value, //900-4500
        note: document.querySelector("#create_note").value //100-400
    };
   // var s = "This., -/ is #! an $ % ^ & * example ;: {} of a = -_ string with `~)() punctuation";
  //  var punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const titleLen = data.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@]/g,"").length;
    const postLen = data.post.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@]/g,"").length;
    const noteLen = data.note.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@]/g,"").length;
    let allFalse = true; 
    if(titleLen > 90 || titleLen<45)
    {
        console.log("Title len warning.");
        console.log("Title Len: " + titleLen);

        const warningLength = document.querySelector("#titleLabel");
        warningText = document.createElement("span");
        warningText.setAttribute("class", "warningTexts");
        warningText.setAttribute("id", "titleWarning");
        warningText.textContent = " Please follow the Char Limitations (45-90)";
       // warningLength.append(warningText);
        if(document.querySelector("#titleWarning")== null)
            {
                warningLength.append(warningText);
            }
        allFalse = false;
    }
    if(postLen>4500 || postLen<900)
    {
        console.log("Post Len warning");
        console.log("Post Len: " + postLen);

        const warningLength = document.querySelector("#postLabel");
        warningText = document.createElement("span");
        warningText.setAttribute("class", "warningTexts");
        warningText.setAttribute("id", "postWarning");
        warningText.textContent = " Please follow the Char Limitations (900-4500)";
       // warningLength.append(warningText);
        if(document.querySelector("#postWarning")== null)
            {
                warningLength.append(warningText);
            }
        allFalse = false; 
    }
    if(noteLen > 400 || noteLen< 100)
    {
        console.log("Note len warning");
        console.log("Note Len: " + noteLen);
        const warningLength = document.querySelector("#noteLabel");
        warningText = document.createElement("span");
        warningText.setAttribute("class", "warningTexts");
        warningText.setAttribute("id", "noteWarning");
        warningText.textContent = " Please follow the Char Limitations (100-400)";
        if(document.querySelector("#noteWarning")== null)
        {
            warningLength.append(warningText);
        }
        
        allFalse = false;
    }
    if(allFalse == true)
    {
        console.log("You can now see further implementation of the submit button.");
        blogPreview(data); //what will this do?
       // submitButtonBlogProcessing(data);
    }
    //console.log(allFalse);

   // blogPreview(data);
   // console.log("Data 1: " + data[0]);//data 0 is the title
   // console.log("Data 2: " + data[1]);//data 1 is the post content
   // fetch("/postBlog",
    //    {
     //       method: 'POST',
     //       headers:{
     //           'Content-Type':'application/json'
    //    },
    //        body: JSON.stringify(data),
    
    //    });

    
}

function blogPreview(data)
{
    //prints: Paragraphs, title, the note, 
    //Need: authorName
    //data.post = blog Content
    //data.title = blog title
    const paragraphs = data.post.split('\n\n')//split returns an array!
    console.log(paragraphs);
    const title = data.title;
    console.log(title);
    const note = data.note;
    console.log(note);
    const previewBox = document.createElement("div");
    previewBox.setAttribute("id", "previewBox");
    const account = JSON.parse(localStorage.getItem('currentAccount'));
    const authorName = account.username;
    console.log(authorName);
    

    //make another modal box
    
    const processedData =
    {
        paragraphs: paragraphs,
        title: title,
        author: authorName,
        authorNote: note
    };
    blogPreviewModal(processedData);

    //blogPosts needs to have permanence. At the moment, this works, but on refresh the newly implemented blog goes away
   // blogPosts.push({
   //     paragraphs: paragraphs,
   //     title: title,
    //    author: authorName,
    //    authorNote: note

   // });

    //blogs styling:
    //<main>
}

function blogPreviewModal(processedData)
{
    const modal = document.createElement("div");
    modal.setAttribute("class", "blogModal");
         //NOTE: innterHTML does NOT ACTIVATE A SCRIPT!
    const contentDiv = document.createElement("div");
         contentDiv.innerHTML = 
           `
           <main>
          </main>
           `;
           //blog format
          //main, h1 (title), h2(authorName), p -> br(in loop)
          const mainBlock = contentDiv.querySelector("main");
          const header = document.createElement("h1");
          header.textContent = processedData.title;
          mainBlock.append(header);
          const authorBlock = document.createElement("div");
          authorBlock.setAttribute("class", "authorBox");
          const authorName = document.createElement("h2");
          authorName.textContent = "By: " + processedData.author;
          const authorNote = document.createElement("p");
          authorNote.textContent = processedData.authorNote;
          authorBlock.appendChild(authorName);
          authorBlock.appendChild(authorNote);
          mainBlock.append(authorBlock);
          mainBlock.append(document.createElement("br"));
          const paragraphs = processParagraphsBlog(processedData.paragraphs);
          const paragraphBlock = document.createElement("div"); //R
          //use J for an inner array

          const buttonBlock = document.createElement("div");
          

          const confirmButton = document.createElement("button");
          confirmButton.setAttribute("id", "confirmButtonPreviewModal");
          confirmButton.textContent = "Confirm";
            
          const rejectButton = document.createElement("button");
          rejectButton.setAttribute("id", "rejectButton");
          rejectButton.textContent = "Reject";

          buttonBlock.append(confirmButton);
          buttonBlock.append(rejectButton);


          for(let j = 0; j< paragraphs.length;++j)
          {
               //mainBlock.appendChild(paragraphs[j]);  U
               //mainBlock.appendChild(document.createElement("br"));  U
              
                paragraphBlock.append(paragraphs[j]);
                paragraphBlock.append(document.createElement("br"));
               

          }
         
        //  mainBlock.append(confirmButton); U
         // confirmButtonHandler();
         // mainBlock.append(confirmButton);

         // mainBlock.append(rejectButton); U
         // rejectButtonHandler();
         // mainBlock.append(rejectButton);

         // paragraphBlock.appendChild(confirmButton); R
         // paragraphBlock.appendChild(rejectButton); R

         // paragraphBlock.append(buttonBlock);
          mainBlock.appendChild(paragraphBlock);
          //mainBlock.appendChild(buttonBlock);
        
          //contentDiv.appendChild(rejectButton);
          //contentDiv.appendChild(confirmButton);
          contentDiv.appendChild(buttonBlock);
        modal.append(contentDiv);
        
        //append A footer with 2 Buttons: Would you like to post this? yes no
        //If yes, make a new modal box and send a message: Your post with be processed! Close the modal box
        //If no, simply close the modal box
        console.log("Modal appended contentDiv");
        document.body.appendChild(modal);
        rejectButtonHandler();
        confirmButtonHandler(processedData);

}
function confirmButtonHandler(data)
{
    //BUG POTENTIAL: More than 1 Listeners for the confirmButton and such
    //Close the modal after clicking confirm
    //I want to send the blog to myself through an email! close the modal box after pressing confirm
    const confirmButton = document.querySelector("#confirmButtonPreviewModal");
    console.log("Confirm Button clicked. Sending data:", data);
    confirmButton.addEventListener("click", function()
    { //send the blog Data to the database. 
      console.log("confirm Button clicked");
      fetch('/confirmPendingBlog', { //confirmPendingBlog
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
       })
       .then(response => response.json())
       .then(result => {
           alert(result.message);
       })
       .catch(error => {
           console.error('Error:', error);
           alert('An error occurred while posting the blog to Review');
       });
       removeBlogPreviewModal();
    });
    
    
}
function rejectButtonHandler()
{
    const rejectButton = document.querySelector("#rejectButton");
    rejectButton.addEventListener("click", function(){

        console.log("reject button clicked");
        removeBlogPreviewModal();

    });
    
}
function removeBlogPreviewModal()
{
    document.querySelector(".blogModal").remove();
    console.log("Removed the blogPreviewModal");

}
function processParagraphsBlog(paragraphs)
{
    const HTMLArray =[]; //can i make an Array of HTML elements?
    for(let i =0; i<paragraphs.length;++i)
    {
        let pElement = document.createElement("p");
        pElement.setAttribute("class", "previewParagraph");
        //USE INNER HTML VS. JUST TEXTCONTENT TO RENDER IN-LINE HTML!
        pElement.textContent = paragraphs[i];
        console.log(paragraphs[i]);
        
        HTMLArray.push(pElement);
    }
    return HTMLArray;
}
function removeCreateButton()
{
    const createButton = document.querySelector("#createButton");
    createButton.remove();
}
//puts the account Name at the top right
function setAccount()
{
    const account = JSON.parse(localStorage.getItem('currentAccount'));
    const name = account.username;
    console.log(name, 'THE NAME');
    const headerName = document.querySelector(".accountName");
    headerName.innerHTML=name;
}
function emptyAccount()
{
    const headerName = document.querySelector(".accountName");
    headerName.innerHTML="";
}
function validateAccount(data){ 
    //fetch: ('postURL', 
    //{
  //      method:,
   //     headers: {

   //     },
    //    body: JSON.stringify(data),
  //  })
    //Do a POST request: fetch a certain url, describe the method, headers and body to CORRECT PROCESS the POST
    //Using the result of the POST request with .then(response), implement some logic
    //Make sure you catch errors in the process.
    //response is generated from the POST request, logic handled in the POST function
    //response.json streamlines parsing a pure string with a JS object

    fetch('/createAccount', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
       })
       .then(response => response.json())
       .then(result => {
           alert(result.message);
       })
       .catch(error => {
           console.error('Error:', error);
           alert('An error occurred while creating the account.');
       });
}
function loadAboutPage()
{
    const contentDiv = document.querySelector(".blogPost");
    contentDiv.innerHTML =
    `
    <main>
    <h1>What Is This Blog About?</h1>
    <p>This blog is used to share ideas and opinions about video games. The blog seeks to
    bring forth thoughtful ideas about game design, user experience, and passionate kinship in respect to the Gaming industry!</p>
    <br>
    <p> For business inquiries, contact me! </p>
    </main>
    `;
}
async function loadBrowsePage()
{
    //NOTE: innerHTML does NOT ACTIVATE A SCRIPT!
    const contentDiv = document.querySelector(".blogPost");
    contentDiv.innerHTML = 
    `
    <main>
    <h1>Try Some Other Articles!</h1>
    </main>
    `;
    //loadArticleTitlesRevised(); this method might not work because of scope with contentDiv
    const mainBlock = contentDiv.querySelector("main");
    const blogPosts = await fetchBlogPosts();

    blogPosts.forEach(post => {
        const button = document.createElement("button"); 
        button.textContent = post.title; 
        button.setAttribute("class", "blog-title");
        mainBlock.appendChild(button); 
        mainBlock.appendChild(document.createElement("br"));
        //now have buttons: blog-title class name
        const titleButtons = document.querySelectorAll(".blog-title");
        titleButtonFunctionality(titleButtons);
    });

}
function titleButtonFunctionality(titleButtons)
{
    titleButtons.forEach(titleButton=>{
        titleButton.addEventListener("click", function()
        {
            const titleButtonContent = titleButton.textContent;
            loadBlogPost(titleButtonContent);

        });
    
    });
}

function loadBlogPost(title)
{
    for(let i = 0; i<blogPosts.length; ++i)
    {
        if(title===blogPosts[i].title)
        {
             //NOTE: innterHTML does NOT ACTIVATE A SCRIPT!
          const contentDiv = document.querySelector(".blogPost");
          contentDiv.innerHTML = 
            `
            <main>
           </main>
            `;
            //blog format
           //main, h1 (title), h2(authorName), p -> br(in loop)
           const mainBlock = contentDiv.querySelector("main");
           const header = document.createElement("h1");
           header.textContent = blogPosts[i].title;
           mainBlock.append(header);
           const authorBlock = document.createElement("div");
           authorBlock.setAttribute("class", "authorBox");
           const authorName = document.createElement("h2");
           authorName.textContent = "By: " + blogPosts[i].author;
           const authorNote = document.createElement("p");
           authorNote.textContent = blogPosts[i].authorNote;
           authorBlock.appendChild(authorName);
           authorBlock.appendChild(authorNote);
           mainBlock.append(authorBlock);
           mainBlock.append(document.createElement("br"));
           const paragraphs = processParagraphs(blogPosts[i]);
           //use J for an inner array
           for(let j = 0; j< paragraphs.length;++j)
           {
                mainBlock.appendChild(paragraphs[j]);
                mainBlock.appendChild(document.createElement("br"));
                //append a button at the bottom of each paragraph.

           }

        }
    }
}
function processParagraphs(post)
{
    const HTMLArray =[]; //can i make an Array of HTML elements?
    for(let i =0; i<post.paragraphs.length;++i)
    {
        let pElement = document.createElement("p");
        //USE INNER HTML VS. JUST TEXTCONTENT TO RENDER IN-LINE HTML!
        pElement.textContent = post.paragraphs[i];
        console.log(post.paragraphs[i]);
        
        HTMLArray.push(pElement);
    }
    return HTMLArray;
}
//const blogPosts =[{
 //   paragraphs:["Hello my friend!", "Awesome stuff you have here!"],
 //   title:"A warm welcome!",
 //   author:"Jim Martinez",
  //  authorNote:"Jim the man is a big man who enjoys big manly endeavors."
//},{
 //   paragraphs:["Everybody gets one."],
  //  title:"Spider-Man",
  //  author:"Jymothy Greene",
   // authorNote:"Jymothy is so cool"
//},
//{
   // paragraphs:["It’s been almost six years since the release of Fire Emblem Three Houses. Seven since the release of the last 3DS game, Fire Emblem Revelations. What was once an IP on the fringe of certain death, was saved by the glorious display that was Fire Emblem Awakening on the 3DS. Fire Emblem Awakening not only saved the Fire Emblem IP from being gone for good, but it completely revitalized the series, and several games have been made since Awakening.", "            What about Fire Emblem Awakening was SO enticing to masses that wasn't there before? Was it the support system? The engrossing story? Or, perhaps, the lucrative Lunatic+ difficulty that made the game impossibly hard?","            The answer is actually  <s>the dating simulator.</s> convoluted, and subjective at best. However, I propose that it was the sense of creation you got in the game. The sense of creation that you got through your supports, and the child units that you create.", "            While child units were already implemented in a previous game in the series, Genealogy of the Holy War, this game was never released outside of Japan. It’s a shame really; the mechanic works very similarly to how it works in Awakening, in that units will love each other and make children each generation. The children inherit stats, and you can mix and match units to have different parents for replayability.","            The mechanic already existing in a previous game may defeat my argument, but it’s important to keep in mind that innovation in Fire Emblem does not get much more intense than that in for a while. After the Holy War, which was the 4th game in the series, the next 8 games have virtually no innovation. This is a crass statement, and it should be noted as such, but there’s a parallel I am trying to make: Fire Emblem and Pokemon.","Bear with me.", "            Another IP that has been so formulaic in its presentation, Pokemon has shown tremendous revitalization with the newer games selling like hotcakes, and even VGC becoming insanely popular. The newer games are rampant with new mechanics, such as Dynamax, mega evolution, Z-moves, and the terastal effect. Pokemon games are more than getting your gym badges and completing the pokedex; the game is about mastering a new aspect of the series.",
   //     "	        Going back to Fire Emblem, while the child units were not new, the pair up system that Awakening carefully developed was insanely memorable. It allowed new strategies and even MORE replayability by pairing up different units. It was easy to cheese the pair up system and make unkillable behemoths, but that’s just more fun if you ask me. It can even be considered equal to the newer mechanics that the Fire Emblem series has explored, such as gambits in FE Three Houses or the Engage system in FE Engage.", "            By looking at these 2 IP’s and noticing what makes Nintendo successful, their core philosophy of always innovating seems to ring true for what makes a game good. Still, I always wonder why games don't COMPOUND their innovation. Dynamax is gone and out the window for Pokemon, and the engage system is highly likely to never return. All of these wonderful mechanics we all come to love may be briefly welcomed in reality."
   //  ],
   //title:"Nintendo’s Core Philosophy Explored: Studying Pokemon and Fire Emblem",
   // author:"Sammy Martinez",
   // authorNote:"Sammy Martinez is a CS graduate who loves to spend his free time playing tennis, playing video games, listening to music, and drinking coffee."
//}];

//let blogPosts = []; // Use `let` so we can update it later

// Function to fetch blog posts from the server
//async function fetchBlogPosts() {
    //try {
      //  const response = await fetch('/loadBlogPosts'); // Adjust URL if needed
      //  if (!response.ok) throw new Error("Failed to fetch blog posts");
        
     //   blogPosts = await response.json(); // Store fetched data in the variable
     //   console.log("Fetched blog posts:", blogPosts); // Debugging: Log the fetched data
   // } catch (error) {
   //     console.error("Error fetching blog posts:", error);
   // }
//}

// Call the function to fetch blog posts
//fetchBlogPosts();



function loadArticleTitlesNaive()
{
    let titleArray = [];
    blogPosts.forEach(post => {
        titleArray.push(post.title); //post is a placeholder variable representing each object in blogPosts
    });
    for(let i = 0; i < titleArray.length; ++i)
    {
        console.log(titleArray[i]);
    }
}
function loadArticleTitlesRevised()
{
    const mainBlock = contentDiv.querySelector("main");

    // Loop through the blog posts and create <p> elements for each title
    blogPosts.forEach(post => {
        const paragraph = document.createElement("p");
        paragraph.textContent = post.title; // Set the title as the text content
        mainBlock.appendChild(paragraph); // Append the <p> element to the <main> block
    });
}
function isSomeoneLoggedIn()
{
    
    if(JSON.parse(localStorage.getItem("currentAccount"))===null)
    {
        console.log("No one is logged in.");
        return false;
    }
    else{
        return true;
    }
}


