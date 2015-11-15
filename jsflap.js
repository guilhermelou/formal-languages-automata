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
	// property used to determine if the line is straight=0, curve top=1, curve bottom=2
    this.bridge = 0;
};

//BEGIN OF TRANSITION METHODS
//Method to draw a single transition
Transition.prototype.drawTransition = function(){

};
//END OF TRANSITION METHODS


//Class State
//Don't need parammeters
var State = function(){
	//Start without any transitions
	//w3 recommends avoid new Array()
	this.transition = [];
	//All booleans will be false by default
	this.active = false;
	this.ini = false;
	this.end = false;
	// VISUAL PROPERTIES
	this.x = 0;
    this.y = 0;
    this.color;
    this.ray = 20;
    this.label = label;
};

//BEGIN OF STATE METHODS
//addTransition
//Add one transation to state trasations list
//Change codes like state1.transation.push(trans)
//To codes like state1.addTransation(trans)
State.prototype.addTransition = function(trans){
	this.transition.push(trans);
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
	this.state = [];
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
//function use to load the var _canvas with the proper element
function initCanvas()
{
	_canvas = document.getElementById("drawCanvas");
	if (_canvas.getContext){
      _context = _canvas.getContext('2d');
    }
};
//function used to clear the canvas and redraw everything
function updateCanvas()
{
	//_canvas = document.getElementById("drawCanvas");
};
