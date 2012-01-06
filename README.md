# AsyncEventEmitter

AsyncEventEmitter is an asynchronous implementation of EventEmitter found in Node.js

## API

#### emitter.addListener( event, listener )
#### emitter.on( event, listener )

Adds a listener to the end of the listeners array for the specified event.

#### emitter.emit( event, args... )

Invoke each of the listeners that may be listening for the specified event in order but on `process.nextTick()`.

#### emitter.removeListener( event, listener )

Remove a listener from the listener array for the specified event. 

#### emitter.removeAllListeners( event )

Removes all listeners for an event. If an event is not specified, removes *ALL* listeners

## Licence

(The MIT License)

Copyright (c) 2011-2012 Tristan Slominski <tristan.slominski@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.