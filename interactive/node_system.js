/**TODO
 * -Make word cloud clickable to reveal definitions, examples, links, etc...
 * 
 * -
 */

let cnv;
let nodeFont;
const mainNodes = [];
const exampleSentences = [];
let currentExample = 0;
let scaling = 1;
let translation = {x: 0, y: 0};


const APPLET_STATE = {
    LOADING: "LOADING",
    IDLE: "IDLE",
    ACTIVE: "ACTIVE"
}

let currentState = APPLET_STATE.LOADING;


function exampleTextStyle(bounds, isKeyword, connection){
    if(isKeyword){
        fill(20, 200, 220);
        noStroke();
        rect(bounds.x, bounds.y, bounds.w, bounds.h);

        stroke(0, 80);
        line(bounds.x + bounds.w/2, bounds.y + bounds.h/2, connection.position.x, connection.position.y);
    }
    fill(0);
    stroke(0);
}


function ProcessMainNodes(){
    for(let i = 0; i < mainNodes.length; i++){
        for(let j = i + 1; j < mainNodes.length; j++){
            mainNodes[i].checkNodeDistance(mainNodes[j]);
        }
    }
}

function ProcessSubNodes(){
    mainNodes.forEach((mnode) => {
        for(let i = 0; i < mnode.subNodes.length; i++){
            for(let j = i + 1; j < mnode.subNodes.length; j++){
                mnode.subNodes[i].checkNodeDistance(mnode.subNodes[j]);
            }
    }
    });
}

function createMainNode(params){

    //Physics & Transform
    let radius = params.radius || 50;
    const proximityThreshold = params.proximityThreshold || 120;
    const acceleration = createVector();
    const velocity = createVector();
    const position = params.position || createVector();
    const friction = 0.2;
    const minimumSquareVelocity = 0.01;
    const moveSpeed = 0.3;

    let nodeText = params.nodeText || "default";

    //SubNodes
    const subNodes = [];

    function addSubNode(params){
        params.parent = mainNode;
        subNodes.push(createTextNode(params));
    }

    function checkNodeDistance(otherNode){
        if(p5.Vector.dist(mainNode.position, otherNode.position) > (proximityThreshold + radius*2)) return;
        const dir = p5.Vector.sub(mainNode.position, otherNode.position).normalize();
        addForce(p5.Vector.mult(dir, moveSpeed));
        otherNode.addForce(p5.Vector.mult(dir, -moveSpeed));
    }

    function addForce(force){
        acceleration.add(force);
    }

    function update(){
        velocity.add(acceleration);
        acceleration.set(0, 0);
        position.add(velocity);
        velocity.mult(1-friction);
        if(velocity.magSq() < minimumSquareVelocity) velocity.set(0, 0);
        //console.log(velocity);

        subNodes.forEach((node) => node.update());
        subNodes.forEach((node) => node.render());
    }

    function render(){
        stroke(20);
        fill(0, 0);
        circle(position.x, position.y, radius*2);
        fill(0);
        text(nodeText, position.x, position.y);
    }

    const mainNode = {
        get radius(){return radius},
        get position(){return position.copy()},
        get subNodes(){return [...subNodes]},
        addSubNode,
        checkNodeDistance,
        addForce,
        update,
        render
    }

    return mainNode;
}

function createTextNode(params){
    let textString = params.textString || "default text";
    let parent = params.parent;

    let theta = random(-Math.PI, Math.PI);
    let radius = parent.radius * random(1.5, 1.7);
    let thetaThresh = 0.6; //relate to radius to make constant...
    let thetaAcc = 0;
    let thetaVel = 0;
    let thetaFriction = 0.15;
    let thetaForce = 0.0046; //relate to radius to make constant...
    let position = createVector();

    let rotOffset = random(-0.15, 0.15);

    function calcPos(){
        position.x = Math.cos(theta) * radius;
        position.y = Math.sin(theta) * radius;
    }
    calcPos();

    function addForce(force){
        thetaAcc += force;
    }

    function checkNodeDistance(otherNode){
        const dist = theta - otherNode.theta;
        if(Math.abs(dist) > thetaThresh) return;
        addForce(thetaForce * Math.sign(dist));
        otherNode.addForce(thetaForce * -Math.sign(dist));
    }

    function update(){
        if(!thetaVel && !thetaAcc) return;
        thetaVel += thetaAcc;
        thetaAcc = 0;
        theta += thetaVel;
        if(Math.abs(theta) > Math.PI) theta = (Math.PI-(theta%Math.abs(theta))) * -Math.sign(theta);
        thetaVel *= 1-thetaFriction;
        if(Math.abs(thetaVel) < 0.0001) thetaVel = 0;
        calcPos();
    }

    function render(){
        //get xy pixel dimensions of text node?
        fill(0);
        noStroke();
        push();
        translate(parent.position.x - position.x, parent.position.y - position.y);
        rotate(rotOffset);
        text(textString, 0, 0);
        pop();
    }

    const subNode = {
        get theta(){return theta},
        update,
        render,
        checkNodeDistance,
        addForce,
        get position(){return {x:parent.position.x-position.x, y:parent.position.y - position.y}},
    }

    return subNode;
}

function createTextObject(params){
    /*
    const tags = [];
    const externalLinks = []; //examples
    const definition = params.definition || "no definition";
    
    const connectionPoints = [];
    */
    let textString = params.textString || "default";
    const connection = params.connection;

    const font = params.font //|| get current default font????
    const isKeyword = params.isKeyword;
    let bounds;
    const textPosition = params.textPosition || {x:0, y:0};
    let ownOffsetX = font.textBounds(textString, 0, 0).w / 2;
    let offsetX = 0;
    
    function setBounds(){
        bounds = font.textBounds(textString, textPosition.x + ownOffsetX + offsetX, textPosition.y);
    }

    function styleFunction(){
        if(params.styleFunction) params.styleFunction(bounds, isKeyword, connection);
    }

    function render(){
        styleFunction();
        text(textString, textPosition.x + ownOffsetX + offsetX, textPosition.y);
    }

    return {
        render,
        get ownOffsetX(){return ownOffsetX},
        get offsetX(){return offsetX},
        set offsetX(val){offsetX = val},
        set positionX(val){textPosition.x = val},
        set positionY(val){textPosition.y = val},
        setBounds,
    }
}

function createExampleText(params){
    const textData = params?.textData || [];
    const textPosition = params.textPosition || {x:0, y:0};

    function addTextData(data){
        data.positionX = textPosition.x;
        data.positionY = textPosition.y;
        for(let i = 0; i < textData.length; i++){
            data.offsetX += textData[i].ownOffsetX * 2;
        }
        data.setBounds();
        textData.push(data);
    }

    function render(){
        textData.forEach((data) => {
            data.render();
        })
    }

    return {
        render,
        addTextData,
    }
}