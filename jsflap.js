//GLOBAL VARS
_canvas = null;
_context = null;
_automaton = null;
//BEGIN OF CLASSES
//Class Transition
//Requires two param
//pattern - the pattern to be used on transition
//next - the next state of automaton
var Transition = function(pattern, next) {
	this.pattern = pattern;
	this.pattern_rect = {'x':0, 'y':0, 'width':0, 'height':0};
	this.next = next;
	// VISUAL PROPERTIES
	// property used to determine if the line is straight=0, curve top=1, curve bottom=-1
    this.bridge = 0;
};

//BEGIN OF TRANSITION METHODS
//Method to draw a single transition, origin is the state that the transition starts
//y_factor is the factor to prevent multiple transition's text over each other
Transition.prototype.drawTransition = function(origin, y_factor){
  	var orig_x = origin.x;
  	var orig_y = origin.y;
  	var dest_x = this.next.x;
  	var dest_y = this.next.y;
  	var radius = this.next.radius;
	var bridge = this.bridge;
	var color = "black";
  	var text_x = text_y = 0;
	var text = this.pattern;
	_context.font = "14px Arial";
    var text_size = _context.measureText(text);
	var arrow = [];
	//Curve to the same State
	if (origin == this.next)
	{
		//setting control points
	  	cp1 = {'x':orig_x-65, 'y':orig_y-75};
	  	cp2 = {'x':orig_x+65, 'y':orig_y-75};

		//calculating the text location
	  	text_x = (cp2.x - cp1.x)/2 + cp1.x - text_size.width/2;
    	text_y = cp1.y + 15 - 15*y_factor;		

		//calculate the arrow
	  	arrow = calculateArrow(cp1.x, cp1.y, dest_x, dest_y, radius);
	  	
	  	//adjusting arrow
	  	arrow.mid_x +=1;
	  	arrow.mid_y -=1;
	  	arrow.right_x +=1;
	  	arrow.right_y -=1;
	  	arrow.left_x +=1;
	  	arrow.left_y -=1;
	  	//draw a bezier curve
	  	drawBezierCurve(orig_x, orig_y, orig_x, orig_y, cp1, cp2);
	}
	else
	{
		//straight line between states
		if (bridge == 0)
	    {
	    	//calculating the text location
	        text_x = (dest_x - orig_x)/2 + orig_x - text_size.width/2;
	        text_y = ((dest_y - orig_y)/2 + orig_y - 5) - y_factor*15;
            
	    	//calculate the arrow
		  	arrow = calculateArrow(orig_x, orig_y, dest_x, dest_y, radius);
		    
		    //line
		    drawLine(orig_x, orig_y, arrow.mid_x, arrow.mid_y, color);		
	    }
	    //curved line between states
	    else
	    {
	    	//calculating the text location
	    	
	    	//calculating control point
	    	cp = calculateControlPoint(orig_x, orig_y, dest_x, dest_y, bridge)

	    	//calculating the text location
	    	text_x = cp.x;
	    	if (cp.y<cp.my)
	    		control_factor = -bridge
	    	else
	    		control_factor = bridge
	    	text_y = cp.y + 5 + (bridge*control_factor)*(y_factor*15);
	    	//calculate the arrow
	    	arrow = calculateArrow(cp.x, cp.y, dest_x, dest_y, radius);

	    	//draw curve
	    	drawQuadCurve(orig_x, orig_y, arrow.mid_x, arrow.mid_y, cp, color);		
	    }
	}
	//drawing the text
	_context.fillStyle = color;
	_context.fillText(text, text_x, text_y);
    //save the text rect for mouse targeting
    this.pattern_rect = {'x': text_x, 'y': text_y-10,
		'width': text_size.width, 'height': 10};
    //draw arrow
	drawArrow(arrow,color);
};
//END OF TRANSITION METHODS


//Class State
//Don't need parammeters
var State = function(label){
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
    this.color = 'black';
    this.radius = 20;
    this.label = label;
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

//Method used to find a transition object in position x,y
State.prototype.getTransitionOn = function(x, y) {
    for (var i=0; i<this.transitions.length; i++){
		var transition = this.transitions[i];
		if (transition.pattern_rect.x <= x && 
			(transition.pattern_rect.x + transition.pattern_rect.width) >= x &&
			transition.pattern_rect.y <= y && 
			(transition.pattern_rect.y + transition.pattern_rect.height) >= y)
		{
			return this.transitions[i];
	
		}
	}
	return null;
};

//Method to draw a single state
State.prototype.drawState = function(){
	_context.beginPath();
	_context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	_context.strokeStyle = this.color;
	_context.stroke();
	_context.fillStyle = 'yellow';
	_context.fill();
	_context.fillStyle = 'black';
	var text = this.label;
	_context.font = "14px Arial";
    var text_size = _context.measureText(text);
	_context.fillText(text,this.x - text_size.width/2 , this.y );
	_context.closePath();
	
};

//Method to draw the transition array inside a State
State.prototype.drawTransitions = function(){
	for (var i=0; i<this.transitions.length; i++){
		this.transitions[i].drawTransition(this,0);
	}
};
//method used to properly remove the transition
State.prototype.removeTransition = function(trans){
	for (var i = 0; i<this.transitions.length ;i++) {
		if (this.transitions[i] == trans)
		{
			var removed = this.transitions.splice(i,1);
			return removed;
		}
	}
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
Automaton.prototype.drawAutomaton = function(){
	for (var i=0; i<this.states.length; i++){
		this.states[i].drawTransitions();
	}
	for (var i=0; i<this.states.length; i++){
		this.states[i].drawState();
	}
};
//Method use to find a state object in position x,y
Automaton.prototype.getStatetOn = function(x,y){
	for (var i=0; i<this.states.length; i++){
		x1 = (x - this.states[i].x)*(x - this.states[i].x);
		y1 = (y - this.states[i].y)*(y - this.states[i].y);
		radius1 = (this.states[i].radius)*(this.states[i].radius);
		if (x1 + y1 <= radius1){
			return this.states[i];
		}
	}
	return null;
};
//Method use to find any object in position x,y
Automaton.prototype.getElementOn = function(x,y){
	state = this.getStatetOn(x, y);
	if(state != null)
	{
		return state
	}
	else
	{
		for (var i=0; i<this.states.length; i++){
			trans = this.states[i].getTransitionOn(x, y);
			if (trans != null){
				return trans;
			}
		}
	}
	return null
};
//addState
//Add one state to states
//Change codes like states.push(state)
//To codes like automaton.addState(state)
Automaton.prototype.addState = function(state){
	this.states.push(state);
};
//method used to create a state and add to the states list
Automaton.prototype.createState = function(label){
	var state = new State(label);
	this.addState(state);
	return state;
};
//method used to create a transition between the prev and next states
//and set the pattern of a transition
Automaton.prototype.createTransition = function(prev, next, pattern){
	if (prev != null && next != null)
	{
		var trans = new Transition(pattern,next);
		prev.addTransation(trans);
		return trans;
	}
	return null;
};
//method used to get all transitions from automaton
Automaton.prototype.getAllTransitions = function(){
	var array_aux = [];
	for (var i =0; i < this.states.length; i++) 
	{
		current_state = this.states[i];
		array_aux.push.apply(array_aux,current_state.transitions);
	}
	return array_aux;
};
//method used to find all next transitions var to a state
Automaton.prototype.findNextToState = function(state){
	var all_trans = this.getAllTransitions();
	var next_to_state_array = []
	for (var i =0; i < all_trans.length; i++) 
	{
		trans = all_trans[i];
		if (trans.next == state)
		{
			next_to_state_array.push(trans);		
		}
	}
	return next_to_state_array;
};
//method used to set null all next transitions var to a state
Automaton.prototype.removeAllNextToState = function(state){
	var next_to_state_array = this.findNextToState(state);
	var i =0
	for (; i < next_to_state_array.length; i++) 
	{
		next_to_state_array[i].next=null;
	}
	return i;
};
//method used to remove a state from automaton
Automaton.prototype.removeState = function(state){
	for (var i =0; i < this.states.length; i++) 
	{
		if (this.states[i] == state)
		{	
			this.removeAllNextToState(state);
			removed = this.states.splice(i,1);
			return removed;
		}
	}
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

//calculate control point between two states and the mY var to check sides
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
    if(bridge == 1)
    {
        midX = midX + height*normalX; 
        midY = midY + height*normalY; 
    }
    else if (bridge == -1)
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
    cp = {'x':cpx, 'y':cpy, 'my': mY};
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
	//Automaton.drawAutomaton()drawStates();
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
    _automaton = new Automaton();
    //TESTANDOOOO
    state1 = new State('q0');
    state2 = new State('q1');
    trans1 = new Transition("a",state2);
    trans2 = new Transition("b",state1);
    trans3 = new Transition("c",state1);
    state1.addTransition(trans1);
    state2.addTransition(trans2);
    state1.addTransition(trans3);

    trans3.next = state1;

    state1.setXY(250,100);
    state2.setXY(100,200);

    //state1.setXY(200,250);
    //state2.setXY(100,250);
    trans1.bridge = -1;
    trans2.bridge = 1;
    //trans1.drawTransition(state1, 1);
    //trans2.drawTransition(state2, 1);
    //trans3.drawTransition(state1, 1);
    //state1.drawTransitions();
    _automaton.states.push(state1);
    _automaton.states.push(state2);
    _automaton.drawAutomaton();
    //console.log(trans1.next);
    //state1.getTransitionOn(251,35);
    //console.log(_automaton.states.length);
    

    _automaton.getAllTransitions();
    _automaton.removeState(trans1.next);
    console.log(trans1.next);
    
    console.log(state1.transitions);
    state1.removeTransition(trans1);
   	console.log(state1.transitions);
   	// console.log(_automaton.states.length);
   	
    _automaton.getStatetOn(251,74);
    // updateCanvas();
    // automaton.drawAutomaton();
    // automaton.drawAutomaton();
    // updateCanvas();
    // automaton.drawAutomaton();
    //desenhaLigacaoAtual();
};

