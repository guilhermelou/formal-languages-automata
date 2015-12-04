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
    this.bridge = 1;
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
	bridge = this.bridge;
	arrow = [];
	if (origin == this.next)
	{
		//calculate the arrow
	  	arrow = calculateArrow(orig_x-65, orig_y-75, dest_x, dest_y, radius);
	  	
	  	//adjusting arrow
	  	arrow.mid_x +=1;
	  	arrow.mid_y -=1;
	  	arrow.right_x +=1;
	  	arrow.right_y -=1;
	  	arrow.left_x +=1;
	  	arrow.left_y -=1;
	  	
	  	//draw a bezier curve
	  	drawBezierCurve(orig_x, orig_y, orig_x, orig_y, {'x':orig_x-65, 'y':orig_y-75}, {'x':orig_x+65, 'y':orig_y-75});
	}
	else
	{
		if (bridge == 0)
	    {
	    	//drawText()
	    	
	    	//calculate the arrow
		  	arrow = calculateArrow(orig_x, orig_y, dest_x, dest_y, radius);
		    
		    //line
		    drawLine(orig_x, orig_y, arrow.mid_x, arrow.mid_y, color);		
	    }
	    else
	    {
	    	//drawText()
	    	
	    	//calculating control point
	    	cp = calculateControlPoint(orig_x, orig_y, dest_x, dest_y, bridge)

	    	//calculate the arrow
	    	arrow = calculateArrow(cp.x, cp.y, dest_x, dest_y, radius);

	    	//draw curve
	    	drawQuadCurve(orig_x, orig_y, arrow.mid_x, arrow.mid_y, cp, color);		
	    }
	}
	

    //draw arrow
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

//function to draw a quadratic curve
function drawQuadCurve(x1, y1, x2, y2, cp, color)
{
	_context.beginPath();
	_context.moveTo(x1, y1);
	_context.quadraticCurveTo(cp.x, cp.y, x2, y2);
	_context.strokeStyle = color;
	_context.stroke();
	_context.closePath();
};

//function to draw a bezier curve
function drawBezierCurve(x1, y1, x2, y2, cp1, cp2, color)
{
	_context.beginPath();
	_context.moveTo(x1, y1);
	_context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y,  x2, y2);
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

//calculate control point between two states
function calculateControlPoint(orig_x, orig_y, dest_x, dest_y, bridge)
{
	var vx, vy, normalX, normalY, module;
    var midX, midY, midY2;
    
    //calculate the distance between x1 - x2, y1-y2
    vx = orig_x - dest_x + 0.01;     
    vy = orig_y - dest_y + 0.01; 
    normalX = 1;
    normalY = -(vx/vy);
    if(normalY < 1)normalY += -1;
    module = Math.sqrt( 1 + ((vx*vx)/(vy*vy)) );
    //calculating vector normal in (x,y)
    normalX = normalX/module; 
    normalY = normalY/module; 
    //calculating the middle point(x,y)
    midX = 0.5*(orig_x + dest_x); 
    midY = 0.5*(orig_y + dest_y); 
    var mY = midY;
    //(px, py) origin / (p2x, p2y) destiny. / (tx, ty) translated.
    var height = 30.0, tx, ty, px, py, p2x, p2y; 

    //Calculating the apex
    if(bridge == -1)
    {
        midX = midX + height*normalX; 
        midY = midY + height*normalY; 
    }
    else if (bridge == 1)
    {
        midX = midX + (-1)*height*normalX; 
        midY = midY + (-1)*height*normalY; 
    }
    //translation
    tx = -midX; 
    ty = -midY; 
    //center of origin
    midX = midY = 0; 
    //translation of origin
    px = dest_x + tx;
    py = dest_y + ty; 
    //translation of destiny
    p2x = orig_x + tx; 
    p2y = orig_y + ty; 
    var controlY = (midY-(1-0.75)/px)/0.75; 
    var cpx, cpy;
    //control in x,y
    cpx = midX-tx;
    cpy = controlY-ty;
    cp = {'x':cpx, 'y':cpy};
    return cp
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
    state1 = new State();
    state2 = new State();
    trans1 = new Transition("a",state2);
    trans2 = new Transition("b",state1);
    trans3 = new Transition("c",state1);
    state1.addTransition(trans1);
    state2.addTransition(trans2);
    state1.addTransition(trans3);

    trans3.next = state1;

    state1.setXY(100,200);
    state2.setXY(150,20);
    //trans1.drawTransition(state1);
    //trans2.drawTransition(state2);
    trans3.drawTransition(state1);
    //desenhaLigacaoAtual();
};

