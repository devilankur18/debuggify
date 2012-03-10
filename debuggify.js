/* 
 * Debuggify
 * @Author Ankur Agarwal
 */

var Debuggify = Debuggify || (function(w,d){
    
    // Library version
    var version = "0.0.1"
    var apiVersion = 1;
    
    // Application ID
    var appId = 123456;
    
    // Tracking host
    var trackHost = 'localhost:8000'
    var hostUrl = 'http://' + trackHost;
    var postUrl = 'http://' + trackHost;
    
    // UserAgent 
    var ua; //TODO: Implement Useragent
    
    // Cookies
    var cookie; //TODO: Generate cookie For tracking unique user
    
    // Default settings
//    var defaults = {
//          l : false 	//log
//        , w : false     //warning
//        , e : true      //error
//        , x : true      //exception
//        , a : true      //assert
//        , d : false     //dump
//    }

    // Required jQuery features
    var $ = (function() {

        var $ = function( selector, context ) {
//		// The jQuery object is actually just the init constructor 'enhanced'
//		return new jQuery.fn.init( selector, context, rootjQuery );
	};
        // [[Class]] -> type pairs
        var class2type = {};
        var toString = Object.prototype.toString;
        var rdigit = /\d/;
        var hasOwn = Object.prototype.hasOwnProperty;
        var r20 = /%20/g;
        var rbracket = /\[\]$/;
    
        $.extend = function () {

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
            if ( typeof target !== "object" && !$.isFunction(target) ) {
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
                                    if ( deep && copy && ( $.isPlainObject(copy) || (copyIsArray = $.isArray(copy)) ) ) {
                                            if ( copyIsArray ) {
                                                    copyIsArray = false;
                                                    clone = src && $.isArray(src) ? src : [];

                                            } else {
                                                    clone = src && $.isPlainObject(src) ? src : {};
                                            }

                                            // Never move original objects, clone them
                                            target[ name ] = $.extend( deep, clone, copy );

                                    // Don't bring in undefined values
                                    } else if ( copy !== undefined ) {
                                            target[ name ] = copy;
                                    }
                            }
                    }
            }

            // Return the modified object
            return target;
        };
//         console.log($);
        //Borrowed from jquery.extend
        $.extend({
            each: function ( object, callback, args ) {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || $.isFunction( object );

                if ( args ) {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.apply( object[ name ], args ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.apply( object[ i++ ], args ) === false ) {
                                break;
                            }
                        }
                    }

                // A special, fast, case for the most common use of each
                } else {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                                break;
                            }
                        }
                    }
                }

                return object;
            }
            , type: function( obj ) {
                return obj == null ?
                    String( obj ) :
                    class2type[ toString.call(obj) ] || "object";
            }

            , isFunction: function( obj ) {
                return $.type(obj) === "function";
            }

            , isArray: Array.isArray || function( obj ) {
                return $.type(obj) === "array";
            }

            // A crude way of determining if an object is a window
            , isWindow: function( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            }

            , isNumeric: function( obj ) {
                return obj != null && rdigit.test( obj ) && !isNaN( obj );
            }

            , isPlainObject: function( obj ) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if ( !obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow( obj ) ) {
                    return false;
                }

                try {
                    // Not own constructor property must be Object
                    if ( obj.constructor &&
                        !hasOwn.call(obj, "constructor") &&
                        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                        return false;
                    }
                } catch ( e ) {
                    // IE8,9 Will throw exceptions on certain host objects #9897
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for ( key in obj ) {}

                return key === undefined || hasOwn.call( obj, key );
            }
            
            // Generate a string like sprintf in C
            , mysprintf: function () {

                var str = arguments[0];
                var args = Array.prototype.slice.call(arguments,1);

                return str.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined'
                      ? args[number]
                      : '{' + number + '}'
                    ;
                  });
            }

            , buildParams: function ( prefix, obj, traditional, add ) {
                if ( $.isArray( obj ) ) {
                    // Serialize array item.
                    $.each( obj, function( i, v ) {
                        if ( traditional || rbracket.test( prefix ) ) {
                            // Treat each array item as a scalar.
                            add( prefix, v );

                        } else {
                            // If array item is non-scalar (array or object), encode its
                            // numeric index to resolve deserialization ambiguity issues.
                            // Note that rack (as of 1.0.0) can't currently deserialize
                            // nested arrays properly, and attempting to do so may cause
                            // a server error. Possible fixes are to modify rack's
                            // deserialization algorithm or to provide an option or flag
                            // to force array serialization to be shallow.
                            $.buildParams( prefix + "[" + ( typeof v === "object" || $.isArray(v) ? i : "" ) + "]", v, traditional, add );
                        }
                    });

                } else if ( !traditional && obj != null && typeof obj === "object" ) {
                    // Serialize object item.
                    for ( var name in obj ) {
                        $.buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
                    }

                } else {
                    // Serialize scalar item.
                    add( prefix, obj );
                }
            }

            , param: function ( a, traditional ) {
                var s = [],
                    add = function( key, value ) {
                        // If value is a function, invoke it and return its value
                        value = $.isFunction( value ) ? value() : value;
                        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                    };

                // Set traditional to true for jQuery <= 1.3.2 behavior.
    //            if ( traditional === undefined ) {
    //                traditional = jQuery.ajaxSettings.traditional;
    //            }

                // If an array was passed in, assume that it is an array of form elements.
                if ( $.isArray( a ) || ( a.jquery && !$.isPlainObject( a ) ) ) {
                    // Serialize the form elements
                    $.each( a, function() {
                        add( this.name, this.value );
                    });

                } else {
                    // If traditional, encode the "old" way (the way 1.3.2 or older
                    // did it), otherwise encode params recursively.
                    for ( var prefix in a ) {
                        $.buildParams( prefix, a[ prefix ], traditional, add );
                    }
                }

                // Return the resulting serialization
                return s.join( "&" ).replace( r20, "+" );
            }
        });
    
        // Populate the class2type map
        $.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });
    
        return $;
    })();
    
    console.log($);
    var defaults = {
          log: false            // log
        , warning: false        // warning
        , error: true           // error
        , exception: true       // exception
        , assert: true          // assert
        , dump: false           // dump
    }
    
    var messageTypes = ['log','warning', 'error', 'exception', 'assert', 'dump'];
    
    // Main Functions provided to users
    var F = {};
    
    // Empty function
    var f = function(){};
    
    // Storage
    var D;
    
    // Current settings
    var config = {};
    var ret = {};
    var enabled = false;
    
    var data = {};
    
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
    
    var messageDefaults = {
        a: appId
//        , ua:                     // Sent in http Headers
//        , ip:                     // Got from request

        , l: 120                      // Line No
        , f: 'debuggify.js'                     // Filename
        , m: ''                     // Message
        , t: 0                      // Type of message DEFAULT log
//        , url: ''                 // Sent in http Headers as Refferer
//        , c: ''                   // Sent in http Header
//        , ts:                     // generate at server
        , v: apiVersion
    };
    
    function genericFunc(funcName){
        var msg = $.extend({},messageDefaults, {
            m:funcName
        });
        return function (m){
            console.log('Name of the function is ' + funcName );
            msg.m = m;
//            l = m.length;
//            for(var i = 0; i < l; i++){
//                msg.m = m[i];
                sendDataToServer(msg);
                jankyPost(msg)
//            }
        }
    }
    
    /*
     * Initialize the library functions which are available to the users
     */
    function initFunctions () {
        
        for (var i in config) {
            F[ i ] = !config[i] ? f : genericFunc(i);
        }
    }
    
    function registerForErrors(){
        var fe = w.onerror;
        
        w.onerror = function(e){
            console.log(e,arguments);
            
            F.error(arguments[0]);
            
            if(fe && typeof fe == 'function'){
                fe.apply(this, arguments);
            }
            // TO propogate error for other functions to catch
            return true;
        }
    }
        
    function load (o) {
        
        //Get the default config with the user config
        config = $.extend({},defaults,o);
        registerForErrors();
        initFunctions();
        
        //Tracking object to send to the server
//        data = {
//            id : id
//            , ua : ua
//            , cookie : cookie
//            , debugData : []
//        }
        
        processAccumulateData();
        
        console.log(data);
    }
    
    /*
     * Proces Data which is accumulated in _debuggify Array
     */
    function processAccumulateData(){
        
        // Get the commands which are already made by the user
        var D = w['_debuggify'] || [];
        
        if(D.isObject) return false;
        
        // Process the already accumuated data
        var l = D.length;
        for(var i = 0; i < l; i++){
            console.log("Processing Data");
            console.log(D[i]);
            processCmd(D[i]);
        }
        overloadArray();
        return true;
    }
    
    /*
     * Overload the _debuggify Array witth the _debuggify Object
     */
    function overloadArray(){
        
        if(ret.isObject) return false;
        
        //Create Global Object
        ret.isObject = true;
        ret.push = function(cmd){
            processCmd(cmd);
        }
        
        //Overdire Array with object
        w['_debuggify'] = ret;
    }
    
    function processCmd(cmd){
        // Checking for Array
        if(typeof cmd === 'object'){ //TODO: Update check for array
            // Get the function name which is called
            var func = cmd[0],
            // Get the function argunments
                args = Array.prototype.slice.call(cmd,1);
            if(typeof F[func] === "function"){

                // Execute the functions
                F[func].call(this,args)
                //sendDataToServer(args);
            }else{

                config[func] && data.debugData.push(D[i])
                throw 'Invalid function ' + func;
            }
            
        }else{
            // Handle Invalid Data
            throw "Invalid Object";
            console.log(cmd);
        }
    }
    
    function sendDataToServer(msg){
        var img = d.createElement('img');
        img.src = hostUrl + '?' +  $.param(msg) // + '&_=' + Math.round(+new Date()) + count;
    }
    
    //Reference from janky.post, copyright(c) 2011 Thomas Rampelberg <thomas@saunter.org>
    function jankyPost (msg) {
        _form(function(iframe, form) {
            form.setAttribute("action", postUrl);
            form.setAttribute("method", "post");
            _input(iframe, form, msg);
            form.submit();
            setTimeout(function(){
                d.body.removeChild(iframe);              
            }, 3000);
        });
    };
    
    //Reference  from janky.post, copyright(c) 2011 Thomas Rampelberg <thomas@saunter.org>
    function _form (cb){
        var iframe = d.createElement("iframe");
        d.body.appendChild(iframe);
        iframe.style.display = "none";
        setTimeout(function() {
          var form = iframe.contentWindow.document.createElement("form");
          iframe.contentWindow.document.body.appendChild(form);
          cb(iframe, form);
        }, 0);
    }
    //Reference  from janky.post, copyright(c) 2011 Thomas Rampelberg <thomas@saunter.org>
    function _input (iframe, form, data) {
        //var l = data.length;
        for(var i in data){
            var inp = iframe.contentWindow.document.createElement("input");
            inp.setAttribute("type", "hidden");
            inp.setAttribute("name", i);
            inp.value = data[i];
            form.appendChild(inp);
        }
    };
    
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
    
})(window, document);

Dfy = Debuggify();
console.log(Dfy);
Dfy.load();
