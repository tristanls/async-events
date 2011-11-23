/*
 * async-events.js: Asynchronous Event Emitter for Node.js
 * 
 * (C) 2011 Tristan Slominski <tristan.slominski@gmail.com>
 * 
 */

var isArray = Array.isArray;

var AsyncEventEmitter = exports.AsyncEventEmitter = function () {};

AsyncEventEmitter.prototype.emit = function () {
  
  var self = this,
      type = arguments[ 0 ];
  
  // If there is no 'error' event listener then throw.
  if ( type == 'error' ) {
    
    if ( ! self._events || ! self._events.error ||
      ( isArray( self._events.error ) && ! self._events.error.length ) ) {
        
      if ( arguments[ 1 ] instanceof Error ) {
        throw arguments[ 1 ]; // Unhandled 'error' event
      } // if instanceof Error 
      else {
        throw new Error( "Uncaught, unspecified 'error' event." );
      } // unspecified error event
      
      return false; // event not handled
      
    } // if no error listeners
    
  } // type == error
    
  if ( ! self._events ) return false; // no listeners
  
  var handler = self._events[ type ];
  
  if ( ! handler ) return false; // no listeners
  
  if ( typeof handler === 'function' ) {
    
    switch ( arguments.length ) {
      // fast cases
      case 1:

        process.nextTick( function () {
          handler.call( self );
        }); // nextTick
        break;
        
      case 2:
        // need to capture arguments before going into another function
        var arguments1 = arguments[ 1 ];
        
        process.nextTick( function () {
          handler.call( self, arguments1 );
        });
        break;
        
      case 3:
        // need to capture arguments before going into another function
        var arguments1 = arguments[ 1 ],
            arguments2 = arguments[ 2 ];

        process.nextTick( function () {
          handler.call( self, arguments1, arguments2 );
        }); // nextTick
        break;
        
      // slower
      default:
        
        var l = arguments.length;
        var args = new Array( l - 1 );
        for ( var i = 1; i < l; i++ ) args[ i - 1 ] = arguments[ i ];
        
        process.nextTick( function () {
          handler.apply( self, args ); 
        });
        
    } // switch arguments.length
    
    return true; // event handled
    
  } // if typeof handler == function
  else if ( isArray( handler ) ) {
    
    var l = arguments.length;
    var args = new Array( l - 1 );
    for ( var i = 1; i < 1; i++ ) args[ i - 1 ] = arguments[ i ];
    
    var listeners = handler.slice();
    for ( var i = 0, l = listeners.length; i < l; i++ ) {
      
      process.nextTick( function () {
        listeners[ i ].apply( self, args );
      });
      
    } // for i in listeners.length
    
    return true; // event handled
    
  } // else if handler is array
  else {
    
    return false; // event not handled
    
  } // else
  
}; // emit

AsyncEventEmitter.prototype.addListener = function ( type, listener ) {
  
  var self = this;
  
  if ( 'function' !== typeof listener ) {
    
    throw new Error( 'addListener only takes instances of Function' );
    
  } // if listener is not a function
  
  if ( ! self._events ) self._events = {}; // lazy initialize _events
  
  if ( ! self._events[ type ] ) {
    
    // Optimize the case of one listener. Don't need the extra array object.
    self._events[ type ] = listener;
    
  } // if no listeners
  else if ( isArray( self._events[ type ] ) ) {
    
    // if we already have an array, just append
    self._events[ type ].push( listener );
    
  } // listeners exist
  else {
    
    // adding the second element, need to change to array
    self._events[ type ] = [ self._events[ type ], listener ];
    
  } // one listener
  
  return self; // for chaining
  
}; // addListener

// alias
AsyncEventEmitter.prototype.on = AsyncEventEmitter.prototype.addListener; 

AsyncEventEmitter.prototype.removeListener = function ( type, listener ) {
  
  var self = this;
  
  if ( 'function' !== typeof listener ) {
    throw new Error( 'removeListener only takes instances of Function' );
  }
  
  // does not use listeners(), so no side effect of creating _events[ type ]
  if ( ! self._events || ! self._events[ type ] ) return self;
  
  var list = self._events[ type ];
  
  if ( isArray( list ) ) {
    
    var position = -1;
    for ( var i = 0, length = list.length; i < length; i++ ) {
      
      if ( list[ i ] === listener || 
        ( list[ i ].listener && list[ i ].listener === listener ) ) {
        
        position = i;
        break;
        
      } // if found listener
      
    } // for i in list.length
    
    if ( position < 0 ) return self; // listener not found
    
    list.splice( position, 1 ); // remove listener
    
    // delete if no more listeners of the type
    if ( list.length == 0 ) delete self._events[ type ];
    
  } // if have a list of listeners
  else if ( list === listener ||
    ( list.listener && list.listener === listener ) ) {
    
    delete self._events[ type ];
    
  } // have the exact listener
  
  return self; // for chaining
  
}; // removeListener

AsyncEventEmitter.prototype.removeAllListeners = function ( type ) {
  
  if ( arguments.length === 0 ) {
    self._events = {};
    return self;
  } // if not type specified, remove everything
  
  // does not use listeners(), so no side effect of creating _events[ type ]
  if ( type && self._events && self._events[ type ] ) 
    self._events[ type ] = null;
  
  return self; // for chaining
  
}; // removeAllListeners