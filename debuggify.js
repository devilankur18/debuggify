/* 
 * Debuggify
 * @Author Ankur Agarwal
 */

var Debuggify = Debuggify || (function(w,d){
    
    //Library version
    var version = "0.0.1"
    
    //Tracking ID
    var id = 123456;
    
    //UserAgent
    var ua; //TODO: Implement Useragent
    
    //Cookies
    var cookie; //TODO: Generate cookie For tracking unique user
    
    //Default settings
//    var defaults = {
//          l : false 	//log
//        , w : false     //warning
//        , e : true      //error
//        , x : true      //exception
//        , a : true      //assert
//        , d : false     //dump
//    }

    var defaults = {
          log: false 	//log
        , warning: false     //warning
        , error: true      //error
        , exception: true      //exception
        , assert: true      //assert
        , dump: false     //dump
    }
    
    //Main Functions provided to users
    var F = {};
    
    //Empty function
    var f = function(){};
    
    //Storage
    var D;
    
    //Current settings
    var config = {};
    var ret = {};
    var enabled = false;
    	
    function init (o) {
        config = extend(config,defaults,o);

        return {
            log : log,
            error :log,
            warning :log,
            execption :log,
            assert : log
        }
    }
    
    function genericFunc(funcName){
        return function (){
            console.log('Name of the function is ' + funcName );
        }
    }
    function initFunctions () {
        
        for (var i in config) {
            F[ i ] = !config[i] ? f : genericFunc(i);
        }
//        console.log(F);
    }
    
    function load (o) {
        
        //Get the default config with the user config
        config = extend({},defaults,o);
        
        initFunctions();
        
        //Get the commands which are already made by the user
        var D = w["_debuggify"] || []; 
        
        //Tracking object to send to the server
        var data = {
            id : id
            , ua : ua
            , cookie : cookie
            , debugData : []
        };
        
        //Process the already accumuated data
        for(var i = 0; i < D.length; i++){
            
            console.log("Processing Data");
            console.log(D[i]);
            
            //Checking for Array
            if(typeof D[i] === 'object'){ //TODO: Update check for array
                
                //Get the function name which is called
                var func = D[i][0],
                //Get the function argunments
                    args = Array.prototype.slice.call(D[i],1);
                if(typeof F[func] === "function"){
                    
                    //Execute the functions
                    F[func].call(this,args)
                    
                }else{
                    
                    config[func] && data.debugData.push(D[i])
                    throw 'Invalid function ' + func;
                }
            }else{
                //Handle Invalid Data
                throw "Invalid Object";
                console.log(i);
            }
        }
        
        console.log(data);
    }
    
    function sendDataToServer(){
        
    }
    
    function arrayToObject () {
        
    }
    
    function log ( msg ) {
        // console.log(config.template.format("log ",msg))
        console.log(msg);
    }

    return function () {

//            test () ;
            return{
                    __init : init,
                    load : load
            };
    };

    function test () {
            var s = mysprintf("this is {1} {0}", "Zero" , "One" )
            console.log(s);
    }
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

    function mysprintf () {

        var str = arguments[0];
        var args = Array.prototype.slice.call(arguments,1);

        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : '{' + number + '}'
            ;
          });
    }
	
	//Borrowed from jquery.extend
    function extend () {

            var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                    deep = target;
                    target = arguments[1] || {};
                    // skip the boolean and the target
                    i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
                    target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                    target = this;
                    --i;
            }

            for ( ; i < length; i++ ) {
                    // Only deal with non-null/undefined values
                    if ( (options = arguments[ i ]) != null ) {
                            // Extend the base object
                            for ( name in options ) {
                                    src = target[ name ];
                                    copy = options[ name ];

                                    // Prevent never-ending loop
                                    if ( target === copy ) {
                                            continue;
                                    }

                                    // Recurse if we're merging plain objects or arrays
                                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                                            if ( copyIsArray ) {
                                                    copyIsArray = false;
                                                    clone = src && jQuery.isArray(src) ? src : [];

                                            } else {
                                                    clone = src && jQuery.isPlainObject(src) ? src : {};
                                            }

                                            // Never move original objects, clone them
                                            target[ name ] = jQuery.extend( deep, clone, copy );

                                    // Don't bring in undefined values
                                    } else if ( copy !== undefined ) {
                                            target[ name ] = copy;
                                    }
                            }
                    }
            }

            // Return the modified object
            return target;
    }

})(window, document);

Dfy = Debuggify();
console.log(Dfy);
Dfy.load();
