

/*Getting elements by class name returns an HTML collection this is Dynamic*/
/*alternative way to select: */
/*document.querySelectorAll(.navButton)* This is static*/
const buttons = document.querySelectorAll(".navButton");
buttons.forEach(button => {
    button.addEventListener("click", function()
{
    const value = this.value;
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
    else{
        console.log("Unknown value.");
    }
});
});
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
function loadBrowsePage()
{
    //NOTE: innterHTML does NOT ACTIVATE A SCRIPT!
    const contentDiv = document.querySelector(".blogPost");
    contentDiv.innerHTML = 
    `
    <main>
    <h1>Try Some Other Articles!</h1>
    </main>
    `;
    //loadArticleTitlesRevised(); this method might not work because of scope with contentDiv
    const mainBlock = contentDiv.querySelector("main");

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


