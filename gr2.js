//BEGIN OF CLASSES
//Class Rule

var Rule = function(name,rule){
	//Ex:single alpha, like A or B
	this.name = name;
	//Recive something like aA|a will turn ["aA","a"]
	this.description = rule.split("|");
}


var Grammar = function(){
	this.rule = [];
	this.reg = [];
}

Grammar.prototype.addRule = function(rule){
	//Recives something like A > aA|a
	//WHERE NAME > [rule,rule,rule...]
	explode  = rule.split(">");
	tmp_rule = new Rule(explode[0].trim(),explode[1].trim());
	this.rule.push(tmp_rule);
};


Grammar.prototype.findRule = function(name){
	for(var  i=0; i<this.rule.length;i++){
		if(this.rule[i].name == name)
			return i;
	}
	return -1;
}

Grammar.prototype.ruleConv(rule){
	conv = "(";
	for(var i=0;i<this.rule.description.length;i++)
	{
		if()
		
	}
}

Grammar.prototype.generate = function(){
		
}




///TESTE
// S > AB
// A > a|AB
// B > b

gr = new Grammar();
gr.addRule("S > AB");
gr.addRule("A > a|AB");
gr.addRule("B > b");

console.log(gr);
