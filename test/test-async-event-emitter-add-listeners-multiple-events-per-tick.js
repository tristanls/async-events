/*
 * test-async-event-emitter-add-listeners-multiple-events-per-tick.js
 * 
 * (C) 2011 Tristan Slominski <tristan.slominski@gmail.com>
 * 
 */

var assert = require( 'assert' ),
    events = require( '../lib/async-events' );

var asyncEventEmitter = new events.AsyncEventEmitter( { eventsPerTick : 2 } );

var emitCounters = {
  timesHelloEmitted : 0,
  timesFooEmitted : 0,
  timesFoo2Emitted : 0,
  timesBarEmitted : 0,
  timesBazEmitted : 0,
  timesFoozEmitted : 0,
};
var tickCounter = {
  last : 0,
  count : 1
};

var incrementTickCounter = function ( last ) {
  
  if ( tickCounter.last == last ) {
    tickCounter.last = tickCounter.count;
    tickCounter.count++;
  }
  
};

// sanity check
assert.equal( asyncEventEmitter.addListener, asyncEventEmitter.on );

asyncEventEmitter.on( 'hello', function ( a, b ) {
  
  console.log( 'hello' );
  emitCounters.timesHelloEmitted += 1;
  
  assert.equal( 'a', a );
  assert.equal( 'b', b );
  
}); // on 'hello'

asyncEventEmitter.on( 'foo', function () {
  
  console.log( 'foo' );
  emitCounters.timesFooEmitted += 1;
  
  asyncEventEmitter.emit( 'foo2' );
  
}); // on 'foo'

asyncEventEmitter.on( 'bar', function () {
  
  console.log( 'bar' );
  emitCounters.timesBarEmitted += 1;
  
}); // on 'bar'

asyncEventEmitter.on( 'baz', function () {
  
  console.log( 'baz' );
  emitCounters.timesBazEmitted += 1;
  
}); // on 'baz'

asyncEventEmitter.on( 'fooz', function () {
  
  console.log( 'fooz' );
  emitCounters.timesFoozEmitted += 1;
  
}); // on 'fooz'

asyncEventEmitter.on( 'foo2', function () {
  
  console.log( 'foo2' );
  emitCounters.timesFoo2Emitted += 1;
  
}); // on 'foo2'

console.log( 'start' );

asyncEventEmitter.emit( 'hello', 'a', 'b' );
asyncEventEmitter.emit( 'foo' );
asyncEventEmitter.emit( 'bar' );
asyncEventEmitter.emit( 'baz' );
asyncEventEmitter.emit( 'fooz' );

var checkResult = function ( counter, msgPrefix ) {
   
  try {
    
    assert.equal( 1, emitCounters[ counter ] );
    
    console.log( msgPrefix + ' passed on tick ' + tickCounter.count );
        
  } catch ( error ) {
    
    console.log( msgPrefix + ' failed on tick ' + tickCounter.count );
    // maybe hasn't happened yet
    if ( tickCounter.count < 5 ) {
      
      process.nextTick( function () {
        checkResult( counter, msgPrefix );
      });
      
    } else {
      
      // fail assertion
      assert.equal( 1, emitCounters[ counter ] );
      
    } // tried 5 times already
    
  } // catch error
  
  process.nextTick( (function() {
    var last = tickCounter.last;
    return function() {
      incrementTickCounter( last );
    };
  })());
  
}; // checkResult

process.nextTick( function () { incrementTickCounter( 0 ); } );

checkResult( 'timesHelloEmitted', 'hello assertion' ); // should pass first time..
checkResult( 'timesFooEmitted', 'foo assertion' );
checkResult( 'timesFoo2Emitted', 'foo2 assertion' );
checkResult( 'timesBarEmitted', 'bar assertion' );
checkResult( 'timesBazEmitted', 'baz assertion' );
checkResult( 'timesFoozEmitted', 'fooz assertion' );