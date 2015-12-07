//BEGIN OF CLASSES
//Class Rule

var Rule = function(name,rule){
	//Ex:single alpha, like A or B
	this.name = name;
	//Recive something like aA|a will turn ["aA","a"]
	this.description = rule.split("|");
}

Rule.prototype.check = function(pattern){
	//Verify for other rules call, like A > aB|a
	other_rule = [];
	
	for(var i = 0; i < this.description.length; i++)
	{
		var patt = new RegExp("[A-Z]");
		var res = patt.test(this.descrition[i]);
		if(res)
			other_rule.push(this.descrition[i]);
		if(this.description[i] == pattern)
		{
			//We will use the -1 to hit 
			other_rule = -1;	
		}
	}
	//If is valid ou call, return other
	//if not, return -2 (not hit and no call)
	if(other_rule == -1 || other_rule.length > 0)
		return other_rule
	else 
		return -2
}

var Grammar = function(){
	this.rule = [];
}

Grammar.prototype.addRule(rule){
	//Recives something like A > aA|a
	//WHERE NAME > [rule,rule,rule...]
	explode  = rule.split(">");
	tmp_rule = new Rule(explode[0],explode[1]);
	this.rule.push(tmp_rule);
}

Grammar.prototype.execute = function(input){
	var i =0;
	success = true;
	while(input != ""){
		//Keeps the first element
		pattern = input;
		//Remove first element from INPUT
		input.splice(0,1);
		//Gets the result -2, -1 or array
		res = this.rule[i].check(pattern);
		if(res == -2){
			success = false;
			break
		}else if(res == -1 ){
			i++;
			continue
		}else{
			//if get a array, we need check the rules
			for(var j=0;j<res.length;j++){
				for(var k=0;k<this.)
			}
		}

	}
}
