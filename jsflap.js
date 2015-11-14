//Class Transition
//Requires two param
//pattern - the pattern to be used on transition
//next - the next state of automaton
var Transition = function(pattern,next) {
	this.pattern = pattern;
	this.next = next;
}

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
}

//BEGIN OF STATE METHODS

//addTransition
//Add one transation to state trasations list
//Change codes like state1.transation.push(trans)
//To codes like state1.addTransation(trans)
State.prototype.addTransition(trans) = function (){
	this.transition.push(trans);
}


//END OF STATE METHODS

//Class Automaton
//Don't need parameters
//Automaton is a list of states
//FARTURA CHECK THIS:
//WE JUST NEED THE FIST STATE OF AUTOMATON
//BECAUSE WE WILL FOLLOW THE STATE TRANSITION ARRAY
var Automaton = function(){
	this.state = null;
}


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
}

//BEGIN OF STEP METHODS

//checkStep
//Check if patterns match for the test
Step.prototype.checkStep() = function (){
	if(this.transition_pattern == this.test_string)
		return true;
	else
		return false;
}


//END OF STEP METHODS


