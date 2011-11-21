/*
 * test-async-event-emitter-add-listeners.js
 * 
 * (C) 2011 Tristan Slominski <tristan.slominski@gmail.com>
 * 
 */

var assert = require( 'assert' ),
    events = require( '../lib/async-events' );

var asyncEventEmitter = new events.AsyncEventEmitter();

var timesHelloEmitted = 0;
var timesTriedToCheckResult = 0;

// sanity check
assert.equal( asyncEventEmitter.addListener, asyncEventEmitter.on );

asyncEventEmitter.on( 'hello', function ( a, b ) {
  
  console.log( 'hello' );
  timesHelloEmitted += 1;
  
  assert.equal( 'a', a );
  assert.equal( 'b', b );
  
}); // on 'hello'

console.log( 'start' );

asyncEventEmitter.emit( 'hello', 'a', 'b' );

var checkResult = function () {
  
  timesTriedToCheckResult += 1;
  
  try {
    
    assert.equal( 1, timesHelloEmitted );
    
    console.log( 'assertion passed on tick ' + timesTriedToCheckResult );
    
    process.exit( 0 );
    
  } catch ( error ) {
    
    console.log( 'assertion failed on tick ' + timesTriedToCheckResult );
    // maybe hasn't happened yet
    if ( timesTriedToCheckResult < 5 ) {
      
      process.nextTick( checkResult );
      
    } else {
      
      // fail assertion
      assert.equal( 1, timesHelloEmitted );
      
    } // tried 5 times already
    
  } // catch error
  
}; // checkResult

checkResult(); // should fail first time.. 