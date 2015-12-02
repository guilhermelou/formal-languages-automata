//GLOBAL VARS
_canvas = null;
_context = null;
//BEGIN OF CLASSES
//Class Transition
//Requires two param
//pattern - the pattern to be used on transition
//next - the next state of automaton
var Transition = function(pattern,next) {
	this.pattern = pattern;
	this.next = next;
	// VISUAL PROPERTIES
	// property used to determine if the line is straight=0, curve top=1, curve bottom=-1
    this.bridge = 0;
};

//BEGIN OF TRANSITION METHODS
//Method to draw a single transition
Transition.prototype.drawTransition = function(origin){
  	orig_x = origin.x;
  	orig_y = origin.y;
  	dest_x = this.next.x;
  	dest_y = this.next.y;
  	radius = this.next.radius;
	color = "black";
	/*//label
	_context.fillStyle = "black";
	var fontsize = 14;
  	_context.font = fontsize+"px Arial";
  	var x, y;
  	x = (dest_x - orig_x)/2 + orig_x;
  	y = (dest_y - orig_y)/2 + orig_y - 10;
  	
  	//	console.log("LENGTH = " + ligacaoAtual.getTransicoes().length);
  	for (var i = 0; i < ligacaoAtual.getTransicoes().length; i++) 
  	{
  		var text = ligacaoAtual.getTransicoes()[i].getTransicao();
  		var textSize = _context.measureText (text);
		var width = textSize.width;
  		_context.fillText(text, x, y);
  		ligacaoAtual.getTransicoes()[i].setRect(x - 2.5, y - 10, width+5, width+5);
  		y -= 15;
  	};*/
  	
  	//calculate the arrow
  	arrow = calculateArrow(orig_x, orig_y, dest_x, dest_y, radius);
    
    //line
    drawLine(orig_x, orig_y, arrow.mid_x, arrow.mid_y, color);

	//arrow
	drawArrow(arrow,color);
};
//END OF TRANSITION METHODS


//Class State
//Don't need parammeters
var State = function(){
	//Start without any transitions
	//w3 recommends avoid new Array()
	this.transitions = [];
	//All booleans will be false by default
	this.active = false;
	this.ini = false;
	this.end = false;
	// VISUAL PROPERTIES
	this.x = 0;
    this.y = 0;
    this.color;
    this.radius = 20;
    this.label = "";
};

//BEGIN OF STATE METHODS
//addTransition
//Add one transation to state trasations list
//Change codes like state1.transation.push(trans)
//To codes like state1.addTransation(trans)
State.prototype.addTransition = function(trans){
	this.transitions.push(trans);
};

// Methods to make easier to change and get x, y properties
State.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
};
State.prototype.getXY = function() {
    return{
        "x": this.x,
        "x": this.y
    }
};

//Method to draw a single state
State.prototype.drawState = function(){

};

//Method to draw the transition array inside a State
State.prototype.drawTransitions = function(){

};
//END OF STATE METHODS


//Class Automaton
//Don't need parameters
//Automaton is a list of states
var Automaton = function(){
	this.states = [];
};

//BEGIN OF AUTOMATON METHODS
//Method used to draw the state list insite a Automaton
Automaton.prototype.drawStates = function(){

};
//Method used to draw the state list insite a Automaton
Automaton.prototype.drawAutomaton = function(){

};
//END OF AUTOMATON METHODS


//Class Step
//Each transition need a specific step, like
//state1 --(aaa)--> state2
//state1 --(aaaaa)--> state3
//The first transition needs a diffent test than the second(3a vs 5a)
//So, we will define the step on construct
//Requires two parameters
//transition - is the object of transition
//test_string - is the current test string(see class below to understand)
var Step = function(transition,test_string){
	//Check if the pattern is bigger than test_string
	//avoid trying call substr with invalid parameters
	if(transition.pattern.length >= test_string.length )
		this.transition_pattern = transition.pattern.substr(test_string.length);
	else
		//transition_pattern recive a empty string
		//this will make the check method returns false
		this.transition_pattern = "";
	this.test_string = test_string;
};

//BEGIN OF STEP METHODS
//checkStep
//Check if patterns match for the test
Step.prototype.checkStep = function (){
	if(this.transition_pattern == this.test_string)
		return true;
	else
		return false;
};
//END OF STEP METHODS
//END OF CLASSES

//BEGIN OF FUNCTIONS
//BEGIN OF CANVAS FUNCTIONS

//function used to clear the canvas
function clearCanvas()
{
	_context.clearRect(0, 0, _canvas.width, _canvas.height);
};

//function to draw a line
function drawLine(x1, y1, x2, y2, color)
{
	_context.beginPath();
	_context.moveTo(x1, y1);
	_context.lineTo(x2, y2);
	_context.strokeStyle = color;
	_context.stroke();
	_context.closePath();
};

//calculating arrow
function calculateArrow(orig_x, orig_y, dest_x, dest_y, radius)
{
    var v_link = [];
    n = [];
    var nx = 1;
    var ny;
    v_link[0] = dest_x - orig_x + 0.01;
    v_link[1] = dest_y - orig_y + 0.01;
    var norma = Math.sqrt(Math.pow(v_link[0], 2) + Math.pow(v_link[1], 2));
    v_link[0] /= norma;
    v_link[1] /= norma;
    var pX = dest_x - radius*v_link[0];//arrow in x
    var pY = dest_y - radius*v_link[1];//arrow in y
    //get the three points
    var leftpointX, leftpointY, rightpointX, rightpointY, midpointX, midpointY;
    midpointX = pX;
    midpointY = pY;
 
    ny = -(v_link[0])/v_link[1];
    n[0] = nx;
    n[1] = ny;
    norma = Math.sqrt(Math.pow(n[0], 2) + Math.pow(n[1], 2));
    n[0] /= norma;
    n[1] /= norma;
    leftpointX = (pX - (6)*v_link[0] + (6)*n[0]);
    leftpointY = (pY - (6)*v_link[1] + (6)*n[1]);
    rightpointX = (pX - (6)*v_link[0] - (6)*n[0]);
    rightpointY = (pY - (6)*v_link[1] - (6)*n[1]);
    arrow = {
    	"left_x": leftpointX,
    	"left_y": leftpointY,
    	"right_x": rightpointX,
    	"right_y": rightpointY,
    	"mid_x": midpointX,
    	"mid_y": midpointY};
    return arrow
};

//function to draw the arrow 
function drawArrow(arrow, color)
{
	_context.beginPath();
	_context.moveTo(arrow.mid_x, arrow.mid_y);
	_context.lineTo(arrow.right_x, arrow.right_y);
	_context.lineTo(arrow.left_x, arrow.left_y);
	_context.lineTo(arrow.mid_x, arrow.mid_y);
	_context.fillStyle = color;
	_context.fill();
	_context.closePath();
};

//function used to draw a transition preview right before the mouse is released
function drawTransitionPreview(x1, y1, x2, y2)
{
	clearCanvas();
	drawLine(x1, y1, x2, y2, "gray");
	//drawTransitions();
	//drawStates();
};

//function used to clear the canvas and redraw everything
function updateCanvas()
{
	clearCanvas();
};

//function use to load the var _canvas with the proper element
function initCanvas(canvas_id)
{

	_canvas = document.getElementById(canvas_id);
	if (_canvas.getContext){
      _context = _canvas.getContext('2d');
    }
    
    //TESTANDOOOO
    drawTransitionPreview(0,0,200,200);
    drawTransitionPreview(0,0,200,50);
    state1 = new State();
    state2 = new State();
    trans = new Transition("a",state2);
    state1.addTransition(trans)
    state1.setXY(10,20);
    state2.setXY(150,260);
    trans.drawTransition(state1);
    //desenhaLigacaoAtual();
};
