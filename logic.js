//--------------------TOS TEXT----------------------
const TOS_TEXT = [
    "We value your data, that's why we demand you hand it over to us to sell",
    
    "O̷̘̾ȗ̴̘ṛ̴͠ ̵̞̇p̴͇͌r̶̭͑ĩ̶̺v̵͔͝ḁ̸́c̴͉̓y̶̧͘ ̵͗ͅp̵̖͐ö̷͙l̴͍͆i̴̹͐c̶̹͌y̶͈͘ ̵̟̌ì̷ͅs̸̹̋ ̴̲͝t̴̰̓h̴̻̿a̶̻͛t̴̮͗ ̴̩̿y̷̝̽ó̸̧u̵̮͝ ̷̨̌ḫ̶̎a̴͇͑v̴͚͐e̸̞͑ ̴̭̿ǹ̵̥ő̶͎ ̷̨̂p̵͖̂r̷̮͗ȉ̸̲v̷̦̅a̸͈̎c̵̞̈́y̷̯͝",

    "These terms are subject to change at any point in the future or past",

    "Your privacy means less than nothing to us",

    "I understand that by even having negative thoughts about The Company makes me liable to invasive brain surgery to extract the valuable data goo contained within my skull. Also we may do anyway.",

    "By not consenting to this form I consent to this form.",

    "If you are reading this then you have already consented to the terms outlined in the TOS.",

    "If you have any questions please contact our armed persuasive enforcement team that will visit you shortly to clarify any misunderstandings.",

    "I hereby renege all standard legal remedies and agree that all disputes will be settled in the Dome of Dispute in the state of Delaware where I will fight other dissatisfied customers to the death in order to make a 30 second plea to an AI judge that upon dismissing my case will open a secret door to a fiery cavern beneath my feet where I will plummet to my imminent (but slow) death.",

    "Our blood-thirst dominion over the world is part of our civic duty to reorganise the known universe in a way that aligns with our shareholders interests, what you are you an evil socialist or something?",

]

const SEGWAY_TEXT = [
    "When you find out that the platform you use has implemented an invasive data collection policy and automatically opted you in without notifying you and made it hard to turn off or opt out... ", /*LinkedIn, Android, Samsung... */

    "When you purchase a product that after an update suddenly requires a subscription fee to continue using it...",

    "When a perfectly functional device you purchased cannot be used because the manufacturer has arbitrarily stopped supporting it...",

    "When you log into an important platform and are often presented with a new Terms Of Service that is many pages long and you have to agree that you read and understood them to continue..."

] /*Does that feel like consent to you? */



//State Selection
if(document.getElementById("landing_state")) setupLandingState();
else if(document.getElementById("segway_state")) setupSegwayState();



function setupLandingState(){
    console.log("landing_state");

    //------------------------ Modal ---------------------------
    const modal = document.getElementById("myModal");
    const enterButton = document.getElementById("enter_button");


    // Modal Open Logic
    enterButton.addEventListener("pointerdown", () => {
        modal.style.display = "block";
        SetupDarkPattern();
    });


    //Generate TOS
    const numTerms = 6;
    const ulElement = document.getElementById("tos_list");

    for(let i = 0; i < numTerms; i++){
        const ind = Math.floor(Math.random() * (TOS_TEXT.length));

        const liItem = document.createElement("li");
        liItem.appendChild(document.createTextNode(TOS_TEXT.splice(ind, 1)[0]));
        ulElement.appendChild(liItem);
    }

    ///////////Dark Pattern Functions////////////
    function buttonVanishMouseOver(){
        //Deny Button Vanishes (mouseover)
        const denyBttn = document.getElementById("deny_button");
        denyBttn.addEventListener("pointermove", () => {
            denyBttn.style.display = "none";
        });
    }

    function buttonVanishClick(){
        //Deny Button Vanishes (click)
        const denyBttn = document.getElementById("deny_button");
        denyBttn.addEventListener("pointerdown", () => {
            denyBttn.style.display = "none";
        });
    }

    function buttonAvoid(){
        //Deny Button Moves Away
    }

    function buttonSwitch(){
        //Deny Button Turns To Accept
        const denyBttn = document.getElementById("deny_button");
        let switched = false;
        denyBttn.addEventListener("pointerdown", () => {
            if(switched) return;
            switched = true;
            denyBttn.textContent = "Accept";
            denyBttn.addEventListener("pointerdown", navigateToSegway);

        });
    }


    function mouseFollow(){
        //Accept Follows Mouse
        const acceptBttn = document.getElementById("accept_button");
        document.body.appendChild(acceptBttn);
        const modal =  document.getElementById("modal_content");
        modal.addEventListener("pointerenter", () => {document.body.appendChild(acceptBttn);});
        modal.addEventListener("pointermove", (e) => {
            
            acceptBttn.style.position = "absolute";
            
            const rect = modal.getBoundingClientRect();
            console.log(rect.bottom);
            acceptBttn.style.left = (e.clientX-15)+ "px";
            acceptBttn.style.top = (e.clientY-15) + "px";
            acceptBttn.style.zIndex = 1;
        })
    }

    let prevX = 0;
    let prevY = 0;

    function mouseRepell(){
        //Accept Follows Mouse
        const denyBttn = document.getElementById("deny_button");
        const modal =  document.getElementById("modal_content");
        //console.log(modal.getBoundingClientRect().left)
        modal.addEventListener("pointerenter", (e) => {
            prevX = e.clientX;
            prevY = e.clientY;
        })
        modal.addEventListener("pointermove", (e) => {
            denyBttn.style.position = "absolute";
            //console.log(e.offsetX);
            //const rect = modal.getBoundingClientRect();
            const nX = e.clientX-prevX;
            const nY = e.clientY-prevY;
            prevX = e.clientX;
            prevY = e.clientY;

            denyBttn.style.left = (denyBttn.offsetLeft + nX)+ "px";
            denyBttn.style.top = (denyBttn.offsetTop + nY) + "px";
        })
    }


    function SetupDarkPattern(){
        const darkPatterns = [buttonVanishMouseOver, buttonVanishClick, buttonSwitch, mouseFollow, mouseRepell];

        if(window.innerWidth <= 600) {
            darkPatterns.length = 0;
            darkPatterns.push(buttonVanishClick);
            darkPatterns.push(buttonSwitch);
        }
        
        const modalBttns = document.getElementById("modal_buttons");
        modalBttns.style.position = "relative";
        modalBttns.style.left = "38%";
        
        const acceptBttn = document.getElementById("accept_button");
        acceptBttn.addEventListener("pointerdown", navigateToSegway);
        //acceptBttn.style.marginLeft = "auto";

        const denyBttn = document.getElementById("deny_button");
        //denyBttn.style.marginRight = "auto";

        //Select a random dark pattern
        darkPatterns[Math.floor(Math.random() * (darkPatterns.length))]();
    }


    function navigateToSegway(){
        window.location.href = "segway.html";
    }

}

function setupSegwayState(){
    console.log("segway_state");
    let examples = [...SEGWAY_TEXT];
    
    
    function navigateToPortfolio(){
        window.location.href = "portfolio.html";
    }

    const portfolioButton = document.getElementById("enter_button");
        portfolioButton.addEventListener("pointerdown", navigateToPortfolio);

    const exampleP = document.getElementById("SEGWAY_EXAMPLE");

    let textNode = document.createTextNode(getExample());
    exampleP.appendChild(textNode);
  
    
    function getExample(){
        if(examples.length === 0) examples = [...SEGWAY_TEXT];
        const ind = Math.floor(Math.random() * (examples.length));
        return examples.splice(ind, 1)[0];
    }

    setInterval(() => {
        exampleP.innerText = getExample();
    }, 10000)
    
}




