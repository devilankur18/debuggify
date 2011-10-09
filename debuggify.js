/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/*Extending the string to support the format function*/
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : '{' + number + '}'
    ;
  });
};

var debuggify = (function(){

var d;    
var enabled = false;
var config = {
	template : " module:{0} {1}"
}

function init(){
    if(enabled){
		return
	}
}

function log(msg){
	console.log(config.template.format("log ",msg))
}
function warning(msg){
	
}
function error(msg){
	
}
function execption(msg){
	
}
function assert(msg){
		
}

return{
	log : log,
	error :error,
	warning :warning,
	execption :execption,
	assert : assert
}

})();


//Application
var d = debuggify;
d.log("This a log message");
d.error("This a error message");
d.warning("This a warning message");
d.execption("This a exception message");
d.assert("this is a assert message");
