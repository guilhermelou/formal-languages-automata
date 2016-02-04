//GLOBAL VARS
_canvas = null;
_context = null;
_automaton = null;

//var to identify the element selected
_selected_element = null;
_selected_for_input = null;
//BEGIN OF CLASSES
//Class Transition
//Requires two param
//pattern - the pattern to be used on transition
//next - the next state of automaton
var Transition = function(pattern, next) {
	//Just one element like 'a' or '1'
	//TODO validate pattern to length 1
	if (pattern == '')
	{
		this.pattern = 'λ';
	}
	else{
		this.pattern = pattern;	
	}
	
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
var State = function(x, y, label){
	//Start without any transitions
	//w3 recommends avoid new Array()
	this.transitions = [];
	//All booleans will be false by default
	this.active = false;
	this.ini = false;
	this.end = false;
	// VISUAL PROPERTIES
	this.x = x;
    this.y = y;
    this.color = 'black';
    this.radius = 20;
    this.label = label;
};

//BEGIN OF STATE METHODS
//addTransition
//Add one transition to state trasations list
//Change codes like state1.transition.push(trans)
//To codes like state1.addTransition(trans)
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
	if (this.ini)
	{
		this.drawInitialIndicator();
	}
	if (this.end)
	{
		this.drawFinalIndicator();
	}
	
};

//Method to draw a circle that shows that it is final state
State.prototype.drawFinalIndicator = function(){
	_context.beginPath();
	_context.arc(this.x, this.y, this.radius-(this.radius/5), 0, 2 * Math.PI);
	_context.strokeStyle = this.color;
	_context.stroke();
	_context.closePath();
	
};

//Method to draw a triangle that shows that it is initial state
State.prototype.drawInitialIndicator = function(){
	_context.beginPath();
	_context.moveTo(this.x - this.radius, this.y);
	_context.lineTo(this.x - (this.radius*2), this.y - this.radius);
	_context.lineTo(this.x - (this.radius*2), this.y + this.radius);
	_context.lineTo(this.x - this.radius, this.y);
	_context.strokeStyle = this.color;
	_context.stroke();
	_context.fillStyle = 'gray';
	_context.fill();
	_context.closePath();
	// _context.arc(this.x, this.y, this.radius-(this.radius/5), 0, 2 * Math.PI);
};

//Method to draw the transition array inside a State
State.prototype.drawTransitions = function(){
	//array used to calc a y_factor
	var array_next = [];
	for (var i=0; i<this.transitions.length; i++){
		var next = this.transitions[i].next;
		//counting how many transitions in the same direction
		y_factor = countElementOnArray(array_next, next);
		this.transitions[i].drawTransition(this,y_factor);
		array_next.push(next);
	}
};
function countElementOnArray(array, element)
{	
	count = 0;
	for (var i = 0; i < array.length; i++) {
		if(array[i]==element)
		{
			count++;
		}
	};
	return count;
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

State.prototype.getNextStateByPattern = function(pattern){
	var states = [];
	for(var i=0;i<this.transitions.length;i++)
	{
		if(this.transitions[i].pattern == pattern)
			states.push(this.transitions[i].next);
		
	}
	return states;

}
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
Automaton.prototype.getStateOn = function(x,y){
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
	state = this.getStateOn(x, y);
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
Automaton.prototype.createState = function(x, y, label){
	var state = new State(x, y, label);
	this.addState(state);
	return state;
};
//method used to create a transition between the prev and next states
//and set the pattern of a transition
Automaton.prototype.createTransition = function(prev, next, pattern){
	if (prev != null && next != null)
	{
		var trans = new Transition(pattern,next);
		var same_direction = this.getTransitionsOnDirection(prev, next);
		if (same_direction.length > 0)
		{
			trans.bridge = same_direction[0].bridge;
		}
		else
		{
			var opposite_direction = this.getTransitionsOnDirection(next, prev);
			if(opposite_direction.length > 0)
			{
				for (var i = 0; i < opposite_direction.length; i++) {
					opposite_direction[i].bridge = 1;
				}
				trans.bridge = -1;
			}
			else
			{

			}
		}
		prev.addTransition(trans);
		return trans;
	}
	return null;
};
//method used to get all transitions from automaton
Automaton.prototype.getAllTransitions = function(){
	var array_aux = [];
	for (var i =0; i < this.states.length; i++) 
	{
		var current_state = this.states[i];
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
//method used to find a state from a transition 
Automaton.prototype.findStateFromTrans = function(trans){
	for (var i =0; i < this.states.length; i++) 
	{
		var state_aux = this.states[i];
		for(j=0; j<state_aux.transitions.length; j++)
		{
			if (state_aux.transitions[j]==trans)
			{
				return state_aux;
			}
		}
		
	}
};
//method used to get all transitions in the same direction on the same states
Automaton.prototype.getTransitionsOnDirection = function(prev, next){
	same_direction = []
	pointing_next_array = this.findNextToState(next);
	for (var i = 0; i < pointing_next_array.length; i++) {
		var state_aux = this.findStateFromTrans(pointing_next_array[i]);
		if (state_aux == prev)
		{
			same_direction.push(pointing_next_array[i]);
		}
	}
	return same_direction;
};
//method used to set null all next transitions var to a state
Automaton.prototype.removeAllNextToState = function(state){
	var next_to_state_array = this.findNextToState(state);
	var i =0
	for (; i < next_to_state_array.length; i++) 
	{
		this.removeTransition(next_to_state_array[i]);
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
//method used to remove a transition from automaton
Automaton.prototype.removeTransition = function(trans){
	var state_aux = this.findStateFromTrans(trans);
	state_aux.removeTransition(trans);
};
//method used to remove any element from automaton
Automaton.prototype.removeElement = function(element){
	if (State.prototype.isPrototypeOf(element))
    {
        return this.removeState(element);
    }
    else if (Transition.prototype.isPrototypeOf(element))
    {
        return this.removeTransition(element);
    }
    else
    {
        return null;
    }
};
//method used to properly change the initial state
Automaton.prototype.changeInitial = function(state, ini){
	if (ini)
	{
		for (var i = 0; i < this.states.length; i++) {
				this.states[i].ini=false;
		}
		state.ini = true;	
	}
	else
	{
		state.ini = ini;
	}
};
//method tha returns a array of result by the array of inputs
Automaton.prototype.testArray = function(input_array){
	result_array = [];
	for (var i = 0; i < input_array.length; i++) {
		var machine = new Machine(this.getInitial(),input_array[i]);
		result = machine.execute();
		result_array.push(result);
	}
	return result_array;
};
//method tha returns a array of result by the array of inputs in afd test
Automaton.prototype.testArrayAFD = function(input_array){
	result_array = false;
	for (var i = 0; i < input_array.length; i++) {
		var machine = new Machine(this.getInitial(),input_array[i]);
		result = machine.autoType();
		return result;
		//result_array.push(result);
	}
	return result_array;
};
//method tha returns the initial state from automaton
Automaton.prototype.getInitial = function(){
	for (var i = 0; i < this.states.length; i++) {
		if (this.states[i].ini)
			return this.states[i];
	}
	return null;
};

//Remove Empty moviment for all automaton
Automaton.prototype.removeEmpty = function(){
    var ini 			= this.getInitial();
	var empty_count 	= 0;
	var states_empty 	= [];
	this.removeIsolated();

	for(var i=0;i<this.states.length;i++)
	{
		for(var j=0;j<this.states[i].transitions.length;j++){

			if(this.states[i].transitions[j].pattern == '' || this.states[i].transitions[j].pattern == 'λ'){
				this.eliminateEmpty(this.states[i],j);
			}
		}	
	}
	this.removeIsolated();
	updateCanvas();
}

//Eliminate the empty moviment from the state
//Recive the state and the transition location
Automaton.prototype.eliminateEmpty = function(state,empty_position){
	//store the next reference, the empty transition will be removed
	var next = state.transitions[empty_position].next;
	if(next.end == true )
		state.end = true;
	//step one, remove the empty
	state.removeTransition(state.transitions[empty_position]);
	//Check for empty on the next states and eliminate then first(recursion)
	if(state != next){
		for(i=0;i<next.transitions.length;i++){
			if(next.transitions[i].pattern=='λ'){
				this.eliminateEmpty(next,i);
			}
		}

		//After eliminate all or don't exists empty(base case of recursion), copy the next transitions
		for(i=0;i<next.transitions.length;i++){
			var trans = new Transition(next.transitions[i].pattern,next.transitions[i].next);
			state.addTransition(trans);
		}	
	}
}

//Remove the isolated states
Automaton.prototype.removeIsolated = function(){
	//loop controller
	var remove = true;
	while(remove){
		//prepare for exiting loop
		remove = false;
		for(var i=0;i<this.states.length;i++){
			var origin = this.findNextToState(this.states[i]);

			if(origin.length == 0 && this.states[i].ini == false)
			{
				//avoid to exiting loop, in case of removeState
				this.removeState(this.states[i]);
				remove = true;	
			}
		}	
	}

}

//get the alphabet
Automaton.prototype.getAlphabet = function(){
	alphabet = [];
	
	for(var i=0;i<this.states.length;i++)
		for(var j=0;j<this.states[i].transitions.length;j++)
			if(alphabet.indexOf(this.states[i].transitions[j].pattern) == -1)
				alphabet.push(this.states[i].transitions[j].pattern);
	return alphabet;		
}

Automaton.prototype.getPaths = function(){};


//Method converts AFND to AFD
Automaton.prototype.convertAFD = function(){
	var ini = this.getInitial();
	//don't need to be here, removeIsolated is called from removeEmpty
	//We call here to show the requisit of conversion algorithm
	this.removeIsolated();
	this.removeEmpty();

	//The alphabet of automaton
	var alphabet = this.getAlphabet();
	//An aux to keep the states
	var states = [];

	//To create a array of the new automaton
	//The max of states to compare is 2^(number of automaton states)
	var new_size_x = Math.pow(2,this.states.length);
	var new_size_y = alphabet.length;
	var new_automaton = new Array(new_size_x);
	//Creates and put 0 on all elements of the new_automaton
	for(var i=0;i<new_size_x;i++)
	{
		new_automaton[i] = new Array(new_size_y);
		for(var j=0;j<new_size_y;j++)
			new_automaton[i][j] = 0;	
	}

	var level = [[]];

	//the combinations array will always used together
	var combination = [];
	var combination_aux = [];

	var ini;
	var end = [];

	//rename the states and
	//copy states to a new list
	for(var i=0;i<this.states.length;i++){
		this.states[i].label = i+1;
		states.push(this.states[i]);
		if(this.states[i].ini == true)
			ini = i+1;
			
		if(this.states[i].end == true)
			end.push(i+1);
	}


	var index = states.length;

	//Creates the first part of new_automaton
	//gets the original states and save they transitions 
	for(var i=0;i<states.length;i++)
	{
		for(var j=0;j<alphabet.length;j++)
		{
			var aux = states[i].getNextStateByPattern(alphabet[j]);
			//if have only one state per pattern, we put on the array they index
			if(aux.length == 1){
				var aux_index = parseInt(aux[0].label);
				new_automaton[i+1][j] = aux_index; 
			}else{
				//if we have more then one
				//this if is needed because aux.length == 0 is possible
				if(aux.length > 1)
				{
					//creates a string of label of states
					var conc = "";
					var states_label = [];
					for(var k=0;k<aux.length;k++)
						states_label.push(aux[k].label);
					
					aux2=states_label.sort();
					for(var k=0;k<aux2.length;k++)
						conc = conc+"."+ String(aux2[k]);
						
					conc = conc.slice(1);
					var label = combination.indexOf(conc);
					//Detect a new combination
					if(label = -1)
						combination.push(conc);

					//recovery the index of combination, ambiguous for labels already
					var label = combination.indexOf(conc);
					//Is to indicate  index of the combination, for example:
					//in a automaton with 3 states(q0,q1,q2)
					//We have the index 0 for empty entrys(all states without transition poin to empty)
					//index 1 = q0, index 2 = q1 and index 3 = q2
					//then, index 4 will be a combination, like q0q1(if happens)
					new_automaton[i+1][j] = index+combination.indexOf(conc)+1;
					
					//console.log(combination);
					//console.log(conc);
				}//end if
			}//end else
		}//end for

	}
	
	//console.log(new_automaton);
	//Create the combination of table
	for(var i=0;i<combination.length;i++)
	{
		var elements = combination[i].split('.');
	
		//first we get the content of the members of combination
		//for example, if we have 1.2, we need get elements of 1 and 2
		for(var j=0;j<elements.length;j++)
		{
			for(k=0;k<alphabet.length;k++)
			{
				if(new_automaton[i+index+1][k] == 0)
					new_automaton[i+index+1][k] ="";
				//console.log("Indice "+elements[j]);
				//console.log(new_automaton[elements[j]][k]);
				//we need to avoid the 0 indication
				if(new_automaton[elements[j]][k] != 0)
					new_automaton[i+index+1][k] += "."+String(new_automaton[elements[j]][k]);
			}
		}	

		//remove the dot in the beginning of field
		for(var k=0;k<alphabet.length;k++)
			new_automaton[i+index+1][k] = new_automaton[i+index+1][k].slice(1);

		//Now we detect combinations in combination
		for(var j=0;j<elements.length;j++)
		{
			for(var k=0;k<alphabet.length;k++)
			{
				//avoid simple elements
				if(new_automaton[i+index+1][k].length == 1  || new_automaton[i+index+1][k] === parseInt(new_automaton[i+index+1][k]))
					continue;

				var aux = combination.indexOf(new_automaton[i+index+1][k]);
				
				if(aux == -1)
					combination.push(new_automaton[i+index+1][k]);

				new_automaton[i+index+1][k] = combination.indexOf(new_automaton[i+index+1][k])+1+index;

			}
		}	

		//console.log(elements);	
	}

	//now we get the end states
	for(var i=0;i<combination.length;i++)
	{
		//console.log(combination[i]);
		var elements = combination[i].split('.');
		for(var j=0;j<elements.length;j++)
			for(k=0;k<end.length;k++)
				if(end[k] == elements[j])
					end.push(i+index+1);
			
	}

	//some values are string, so we need convert, a good upgrade will be put the conversion on previous loop
	for(var i=0; i<new_automaton.length;i++)
		for(var j=0;j<alphabet.length;j++)
			new_automaton[i][j] = parseInt(new_automaton[i][j]);
	console.log(new_automaton);
	//now we destroy all states, to constroy new states
	this.states = [];

	var states = [];
	//insert the first element of new automaton
	states.push(ini);
	var current_state = new State(100, 200, 'q'+String(ini));
	current_state.ini = true;
	this.states.push(current_state);
	

	//run on states, when we find new states, we push to states
	for(var i=0;i<states.length;i++)
	{
		//put the current_state equals the element of states array
		for(var j=0;j<this.states.length;j++)
			if(this.states[j].label == 'q'+String(states[i]))
				current_state = this.states[j];

		//get the next elements
		next = new_automaton[states[i]];
		for(var j=0;j<next.length;j++)
		{
			//if is a new element, we need create the state
			is_new = true;
			for(var k=0;k<states.length;k++)
				if(next[j]==states[k])
					is_new = false;
			
			//create the state
			if(is_new)
			{
				var next_state = new State(100, 200, 'q'+String(next[j]));
				for(var k=0;k<end.length;k++)
					if(next[j]==end[k])
						next_state.end = true;
				this.states.push(next_state);
				states.push(next[j]);
			}else // search for the state
				for(var k=0;k<this.states.length;k++)
					if(this.states[k].label == 'q'+String(next[j]))
						next_state = this.states[k];
			//create the transition
			this.createTransition(current_state, next_state, alphabet[j]);
			}
	}

	updateCanvas();

};

Automaton.prototype.findDoublePair = function(pair_array){
	for (var i = 0; i < pair_array.length - 1; i++) {
		var state_1 = pair_array[i][0];
		var next_1 = pair_array[i][1];
		for (var j = i+1; j < pair_array.length; j++) {
			if (j<pair_array.length){
				var state_2 = pair_array[j][0];
				var next_2 = pair_array[j][1];
				if ((state_1 == state_2) && (next_1 == next_2)){
					return [state_2, next_2];
				}
			}
		};
	};
	return null;
};
Automaton.prototype.spliceDoublePair = function(pair_array){
	for (var i = 0; i < pair_array.length - 1; i++) {
		var state_1 = pair_array[i][0];
		var next_1 = pair_array[i][1];
		for (var j = i+1; j < pair_array.length; j++) {
			if (j<pair_array.length){
				var state_2 = pair_array[j][0];
				var next_2 = pair_array[j][1];
				if ((state_1 == state_2) && (next_1 == next_2)){
					pair_array.splice(j,1);
					return [state_2, next_2];
				}
			}
		};
	};
	return null;
};

//Method converts AF to ER
Automaton.prototype.convertRecAFToER = function(current_state, current_er, er_array, trans_array){

	// starting get all transitions and cuting of the loop to same state transitions
	var trans_next_loop = this.getTransitionsOnDirection(
		current_state,current_state);
	var trans_array_left = current_state.transitions.slice();
	trans_array_left = trans_array_left.filter( function ( elem ) {
			return trans_next_loop.indexOf( elem ) === -1;
		});
	// cuting a slice of valid ER
	if (current_state.end){
		er_array.push(current_er.slice());
	}
	// marking hole ER as ()*
	for (var i = 0; i < current_state.transitions.length; i++) {
		var index_double = trans_array.indexOf(current_state.transitions[i]);
		if (index_double>-1){
			
			trans_trouble = trans_array[index_double];
			state_start_loop = this.findStateFromTrans(trans_trouble);
			index_trouble = current_er.indexOf(state_start_loop);
			current_er.splice(index_trouble,0,"(");
			current_er.push(")");
			current_er.push("*");
			er_array.push(current_er.slice());
			trans_array = [];
			return;
		}
	}
	// marking position on array
	current_er.push(current_state);

	// making the loop as (pattern + pattern + ... )*
	if (trans_next_loop.length>0){
		current_er.push("(");
		for (var i = 0; i < trans_next_loop.length; i++) {
			current_er.push(trans_next_loop[i].pattern);
			if (i+1 == trans_next_loop.length){
				current_er.push(")");
				current_er.push("*");			
			}
			else {
				current_er.push("+");			
			}
		}	
		if (current_state.end){
		 	er_array.push(current_er.slice());
		}
	}
	
	// getting multiple arrays in the same direction
	var array_same_direction = [];
	for (var i = 0; i < this.states.length; i++) {
		if (current_state!=this.states[i]){
			var trans_same_states = this.getTransitionsOnDirection(
				current_state,this.states[i]);
			trans_array_left = trans_array_left.filter( function ( elem ) {
				return trans_same_states.indexOf( elem ) === -1;
			});
			array_same_direction.push(trans_same_states);
		}
	}

	// using recursion here
	var aux_er = current_er.slice();
	var aux_trans = [];
	var trans_next;
	
	for (var i = 0; i < array_same_direction.length; i++) {
		var trans_same_direction = array_same_direction[i];
		if (trans_same_direction.length>0){
			current_er = aux_er.slice();
			// checking if are many to the same point
			if (trans_same_direction.length > 1){
				current_er.push("(");
			}
			for (var j = 0; j < trans_same_direction.length; j++) {
				trans_next = trans_same_direction[j];
				
				current_er.push(trans_next.pattern);
				// checking if are many to the same point
				if ((j+1)< trans_same_direction.length){
					current_er.push("+");
				}
				trans_array.push(trans_next);
				aux_trans = trans_array.slice();
			}
			// checking if are many to the same point
			if (trans_same_direction.length > 1) {
				current_er.push(")");
			}
				
			this.convertRecAFToER(trans_next.next, current_er, er_array, trans_array);
			trans_array = aux_trans;

		}
	}
};

Automaton.prototype.convertAFToER = function(){
	var current_state = this.getInitial();
    var current_er = [];
    var er_array = [];
    var pair_array = [];
    var str_er = "";
    this.convertRecAFToER(current_state, current_er, er_array, pair_array);
	for (var i = 0; i < er_array.length; i++) {
		er = er_array[i]
		for (var j = 0; j < er.length; j++) {
			element = er[j];
			if(!(State.prototype.isPrototypeOf(element))){
				str_er += element;
			}
		}
		if (i+1 != er_array.length){
			if (er.length == 0){
				str_er+="λ";
			}
			str_er+="+";
		}
	}
	return str_er;
};

//method used to convert a er on a af as return
Automaton.prototype.convertERToAF = function(er){
	//new automaton
	af = new Automaton();
	prev_state = current_state = null;
	stack = [];
	er = er.replace('$','');
	er = er.replace('^','');
	er = er.replace(']','');
	er = er.replace('[','');
	er = er.split('');
	//checking the er array
	for (var i = 0; i < er.length; i++) {
		if (er[i]=="("){
			//if there is no initial state create one
			if(current_state == null){
				prev_state = af.createState(i*20+50,i*10+50,"qini");
				prev_state.ini = true;
				current_state = prev_state;
			}
			//putting them on stack
			stack.push(current_state);
			stack.push(er[i]);
		}
		else if (er[i]==")"){
			//putting them on stack
			stack.push(current_state);	
			stack.push(er[i]);
		}
		else if (er[i]=="+"){
			//putting on stack
			stack.push(er[i]);
		}
		else if(er[i]=="*"){
			//working on closer
			var token = stack.pop();

			//closer on a single char
			if (token != ")") {
				af.removeState(current_state);
				current_state = prev_state;
				current_state.end = true;
				af.createTransition(current_state, current_state, token);
			}
			//closer on a group ()
			else{
				//getting the start of group (
				while(token!="("){
					token = stack.pop();
				}
				console.log("token");
				console.log(token);
				var old_state = stack.pop();
				console.log(old_state);
				af.createTransition(current_state, old_state, "λ");	
			}
		}
		else{
			//adding transition bettween the same states on "+""
			if (stack[stack.length - 1]=="+") {
				af.createTransition(prev_state, current_state, er[i])
			}
			//adding single transition "ab": (S,a) = B; (B,b) = C;
			else{

				if (prev_state == null){
					prev_state = af.createState(i*20+50,i*10+50,"qini");
					prev_state.ini = true;
				}else{
					prev_state = current_state;
				}
				current_state = af.createState(i*20+100,i*20+100,"q"+i);
				af.createTransition(prev_state, current_state, er[i]);				
			}
			stack.push(er[i]);
		}
	}
	current_state.end = true;
	return af;
};

//state_no_terminal be like {no_terminal: state, ...}
Automaton.prototype.convertGRToAF = function(lhs,rhs){
	var state_no_terminal = {};
	var af = new Automaton();
	var z_state = af.createState(200,100,"Z");
	z_state.end = true;
	for (var i = 0; i < lhs.length; i++) {
		var current_state = state_no_terminal[lhs[i]];
		if (current_state == null){
			var keys = Object.keys(state_no_terminal);
			//console.log(keys);
			current_state = af.createState(i*20+100,i*20+100,lhs[i]);
			if (keys.length == 0) {
				current_state.ini = true;
			}
			state_no_terminal[lhs[i]] = current_state;
		}
		var rule = rhs[i].split('');
		var terminal_string = "";
		var non_terminal_string = "";
		for (var j = 0; j < rule.length; j++) {
			token = rule[j];
			if (token == token.toLowerCase()){
				terminal_string += token;
			}
			else{
				non_terminal_string += token;
			}
		}
		if (non_terminal_string == "") {
			if (terminal_string == "" || terminal_string == "λ") {
				af.createTransition(current_state, z_state, "λ");
			}
			else{
				af.createTransition(current_state, z_state, terminal_string);
			}
			
		}
		else{
			var next_state = state_no_terminal[non_terminal_string];
			if (next_state == null){
				next_state = af.createState(i*20+200,i*20+200,non_terminal_string);
				state_no_terminal[non_terminal_string] = next_state;
			}
			if (terminal_string == "" || terminal_string == "λ") {
				af.createTransition(current_state, next_state, "λ");
			}
			else{
				af.createTransition(current_state, next_state, terminal_string);
			}
		}
	}
	return af;
};
Automaton.prototype.convertStateToLRHS = function(current_state, lhs, rhs, state_visited_array){
	state_visited_array.push(current_state);
	if (current_state.end == true){
		lhs.push(current_state.label);
		rhs.push('λ');
	}
	for (var j = 0; j < current_state.transitions.length; j++) {
			var current_transition = current_state.transitions[j];
			lhs.push(current_state.label);
			rhs.push(current_transition.pattern+current_transition.next.label);
	}
	for (var j = 0; j < current_state.transitions.length; j++) {
			var current_transition = current_state.transitions[j];
			var next_state = current_transition.next;
			if (state_visited_array.indexOf(next_state)==-1){
				this.convertStateToLRHS(next_state, lhs, rhs, state_visited_array);
			}
	}
};

//output on parameters... lhs and rhs
Automaton.prototype.convertAFToGR = function(lhs, rhs){
	var current_state = this.getInitial();
	var state_visited_array = [];
	this.convertStateToLRHS(current_state, lhs, rhs, state_visited_array);
};
//END OF AUTOMATON METHODS



//TEST classes
//They will work like a generic recognizer without aux memory explained in class:
// http://www2.fct.unesp.br/docentes/dmec/olivete/lfa/arquivos/Aula04.pdf
// INPUT
// | | | | | | | | | | | |
//   / \
//    | cursor
//    V
//  |State Machine|

//Input class
var Input = function(input){
	//Input will be  a string, like: "abbcccbabbbabababa" or "1010000100000"
	console.log(input);
	this.input = input.split('');
	//Copy of input, the main input will explode on test ("lol" => "l","o","l")
	this.input_copy = input;
};

//BEGIN INPUT METHODS
Input.prototype.next = function(){
	//Keeps the first element
	pattern = this.input[0];
	//Remove first element from INPUT
	this.input.splice(0,1);

	return pattern;
};

//Verify if input is empty
Input.prototype.isEmpty = function(){
	//console.log(this.input);
	if(this.input == "")
	{
		return true;

	}
	else
		return false;
};
//END INPUT METHODS

//Cursor class
var Cursor = function(){

	//The first location will be in the void =O
	this.state = false;
};

//BEGIN CURSOR METHODs

//FIND NEXT
//The machine state will send the state (q0,q1,q2...) and the pattern('a','b',...)
Cursor.prototype.findNext = function(pattern)
{
	next = [];
	//Test every transition
	//Non determistic automaton can have more then one hit

	for(var i=0; i < this.state.transitions.length;i++)
		if(this.state.transitions[i].pattern == pattern)
			next.push(this.state.transitions[i]); //Add to next, deterministic will have only one element

	//FAIL if don't hit the pattern
	if(next.length == 0)
		return false;

	return next;	

};

//FIND EMPTY
//Detect EMPTY transition
Cursor.prototype.findEmpty = function()
{
	next = [];

	for(var i=0; i < this.state.transitions.length;i++)
		if(this.state.transitions[i].pattern == 'λ')
			next.push(this.state.transitions[i]); //Add to next

	//FAIL if don't hit the pattern
	if(next.length == 0)
		return false;

	return next;	

};


Cursor.prototype.move = function(state){
	this.state = state;
};
//END CURSOR METHODS

//State Machine class( called only MACHINE)
//Construtor need to recive the first element of automaton
var Machine = function(start,input){
	//if reach the end of input in a final state
	//change this to true
	this.test 	= false;
	//A array of cursors, needs to create a new cursor object on every split
	this.cursor 	= [];
	//creates a first cursor on start
	this.cursor[0] 	= new Cursor();
	this.cursor[0].move(start);
	//creates a input
	this.input 		= new Input(input);

	//AFD
	this.AFD		= true;

};

//BEGIN MACHINE METHODS

//STEP
//Moves the state machine
Machine.prototype.step = function(){
	//Gets next input
	pattern 	= this.input.next();
	//Pre calculate the max of loop
	//Because the loop generate new cursor, but this new cursor will be used only in the next loop
	//Then, if loop runs from 0 to 2, a new cursor will be add in 3
	loop_max	= this.cursor.length;
	
	//Aux, if the pattern is invalid to all cursors, the test will FAIL
	success = false;
	for(var i=0; i < loop_max;i++)
	{
		//verify dead cursors
		if(this.cursor[i].state == false)
			continue;
		
		//look for empty
		empty = this.cursor[i].findEmpty();
		//if finds
		if(empty){
			this.AFD = false;
			for(var j=0;j<empty.length;j++)
			{
				//Create new cursors to new empty moviment
				tmp_cursor = new Cursor();
				tmp_cursor.move(empty[j].next);
				this.cursor.push(tmp_cursor);
				//EMpty need to be executed on loop, so we increment loop
				loop_max++;

			}
		}

		//get the next states
		next_states = this.cursor[i].findNext(pattern);
		//If have more than one state, this is a non deterministic
		//Then we need create a new cursor
		if(next_states.length > 1){

			//Mark as AFND
			this.AFD = false;
				
			success = true;
			//Moves the cursor to first next move(the others will need new cursors)
			this.cursor[i].move(next_states[0].next);
			//create  cursors to every state
			for(var j=1;j<next_states.length;j++)
			{
				tmp_cursor = new Cursor();
				tmp_cursor.move(next_states[j].next);
				this.cursor.push(tmp_cursor);
			}
		}else if(next_states.length == 1)
			this.cursor[i].move(next_states[0].next);
		else
			this.cursor[i].move(false);
			
	}

	//If return false, test FAIL
	return success;
};

Machine.prototype.check = function(){
	//Tri-state check
	//-1 FAIL (reach the end but none of cursors are on a terminal state)
	//0 - undefined (input not empty, so test need to continue)
	//1 - SUCESSS (reach the end and one of cursors are on a terminal state)
	success = -1;
	if(this.input.isEmpty()){
		for(var i=0; i < this.cursor.length ;i++){
			//verify dead cursors
			if(this.cursor[i].state == false)
				continue;
			
			if(this.cursor[i].state.end == true)
				success = 1;
		}
	}else{
		success = 0;
	}	
	return success;	
};

//Verify if automaton is AFD or AFND
Machine.prototype.autoType = function(){
	for(var i=0;i<_automaton.states.length;i++){
		sorted = _automaton.states[i].transitions.sort();
		for(var j=0;j<sorted.length-1;j++){
			if(sorted[j].pattern == sorted[j+1].pattern){
				return false;
			}
		}
	}_automaton.states.transitions
	
	if(this.AFD == true)
		return true;
	else
		return false;
}

Machine.prototype.execute = function(){
	success=0;
	while(success==0)
	{
		this.step();
		success = this.check();
	}
	if(success == 1)
		return true;
	else
		return false;
}
//END OF MACHINE METHODS



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
	_automaton.drawAutomaton();
};

//function use to load the var _canvas with the proper element
function initCanvas(canvas_id)
{
	_canvas = document.getElementById(canvas_id);
	if (_canvas.getContext){
      _context = _canvas.getContext('2d');
    }
    _automaton = new Automaton();
	_automaton = _automaton.convertERToAF('^[b(oa+b)]$');
	
    _automaton.drawAutomaton();

};

