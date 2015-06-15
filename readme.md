# Crosstalk

This is a very small, single constructor "library" that will let you create cross-window/tab sync-able objects. It makes use of modern features such as `Object.observe` and `BroadcastChannel` so there are no guarantees it will work everywhere, but it uses polyfills to work in current Chrome, Firefox, and Safari.

## Usage


Ensure you have added the `crosstalk.min.js` script, then you can create an object by passing in an object and the name of the channel it will use. Every object created should use a unique name, otherwise the objects will conflict and update other objects that aren't their cross-window/tab counterparts. Using the `new` keyword is not necessary, but you may use it if you wish.

``` javascript
var foo = CrossTalk({
  first: 'Morty',
  last: 'Sanchez'
}, 'fooChan');

// foo will be { first: 'Morty', last: 'Sanchez' }
```

Or alternatively:

``` javascript
var bar = new CrossTalk('barChan');

// bar will be {}
```

When a new window is opened on the same domain, running the same script, any objects created that share a channel will become synced, adopting the state of the "oldest" object.

Changing attributes of a CrossTalk object is the same as normal:

``` javascript
foo.first = 'Rick';
foo.catchPhrase = 'wubba lubba dub dubs'; 
// foo will reflect the new and updated properties in other windows
// on the same object, foo
```

## Why?

Creating multi-window or multi-monitor websites currently requires using localstorage or websockets. Using CrossTalk™, you can make it JustWork™.
