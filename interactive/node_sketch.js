
//----------------------------Node String Lists----------------------------//

const moneyNodeSubText = ["Consumption", "Subscriptions", "Sales","Pricing", "Lobbyism"
]
const policyNodeSubText = ["Forced Arbitration", "Corruption", "GDPR", "DMCA", "Copyright", "Trademark", "Terms of Service"
];
const privacyNodeSubText = ["Purchase history", "Search history", "Cookies", /*"Prompt history",*/ "Comminication", "Surveillance", "Contacts", "Behavior", "Location", "Camera/mic", /*"Spying",*/ "Personalisation"
];

const timeNodeSubText = ["Read contracts", "Engagement", "Creative Work", "Watch ADs", /*"Train AI",*/ "Scroll", "Cancel Subscription"
];

const agencyNodeSubText = ["Right to repair", "Intellectual Property", "Property", "Freedom", "Ownership", "Consent",
];

const mindNodeSubText = ["Coerce", "Exhaust", "Distract","Propaganda", /*"Trick"*/, "Manipulate", "Knowledge", "Fear",/* "FOMO",*/ "Addiction", "Depression"
];


let startBttn = document.getElementById("start_button")
startBttn.addEventListener("pointerdown", ()=> {
    currentState = APPLET_STATE.ACTIVE;
    startBttn.remove();
});


function preload(){
    nodeFont = loadFont("assets/fonts/GloriaHallelujahRegular.ttf");
}

function setup(){
    cnv = createCanvas(960, 580, document.getElementById("node_sketch"));
    textAlign(CENTER);
    textFont(nodeFont);//textFont('Courier New');

    const moneyNode = createMainNode({position: createVector(220, 180), nodeText: "Money"});
    moneyNodeSubText.forEach((str) => moneyNode.addSubNode({textString: str}));
    mainNodes.push(moneyNode);

    const policyNode = createMainNode({position: createVector(610, 270), nodeText: "Policy"});
    policyNodeSubText.forEach((str) => policyNode.addSubNode({textString: str}));
    mainNodes.push(policyNode);

    const privacyNode = createMainNode({position: createVector(240, 330), nodeText: "Privacy"});
    privacyNodeSubText.forEach((str) => privacyNode.addSubNode({textString: str}));
    mainNodes.push(privacyNode);

    const timeNode = createMainNode({position: createVector(400,240), nodeText: "Time"});
    timeNodeSubText.forEach((str) => timeNode.addSubNode({textString: str}));
    mainNodes.push(timeNode);

    const agencyNode = createMainNode({position: createVector(460,303), nodeText: "Agency"});
    agencyNodeSubText.forEach((str) => agencyNode.addSubNode({textString: str}));
    mainNodes.push(agencyNode);

    const mindNode = createMainNode({position: createVector(344,300), nodeText: "Mind"});
    mindNodeSubText.forEach((str) => mindNode.addSubNode({textString: str}));
    mainNodes.push(mindNode);
    
    //Example Text
    /*
    LinkedIn automatically opted users into a new policy to train their AI models using their posts and interactions without informing them.
    */
    let exampleSentenceA = createExampleText({textPosition:{x: 50, y: 550}});
    exampleSentences.push(exampleSentenceA);
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: "LinkedIn automatically opted users into a new policy to train their AI models using their ", styleFunction: exampleTextStyle}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: "posts", styleFunction: exampleTextStyle, isKeyword: true, connection: mainNodes[4].subNodes[1]}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: " and ", styleFunction: exampleTextStyle}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: "interactions", styleFunction: exampleTextStyle, isKeyword:true, connection: mainNodes[3].subNodes[1]}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: " without ", styleFunction: exampleTextStyle}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: "informing", styleFunction: exampleTextStyle, isKeyword:true, connection: mainNodes[5].subNodes[4]}));
    exampleSentenceA.addTextData(createTextObject({font: nodeFont, textString: " them.", styleFunction: exampleTextStyle}));

    currentState = APPLET_STATE.IDLE;
}

function draw(){
    background(245, 240, 235, 230);

    if(currentState != APPLET_STATE.ACTIVE) {
        background(50, 230);
        return;
    }
    
    //Nodes & Word Cloud
    push();
    translate(translation.x, translation.y);
    scale(scaling, scaling);
    ProcessMainNodes();
    ProcessSubNodes();
    mainNodes.forEach((node) => node.update());
    mainNodes.forEach((node) => node.render());

    //Render Example Text
    if(currentExample > -1) exampleSentences[currentExample].render();
    pop();

    //UI
    //Panning joystick
    //Zoom controls
    //Activate
    //New Example
}

function keyPressed(){
    //scaling += 0.1;
}