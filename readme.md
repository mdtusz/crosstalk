# Crosstalk

This is a very small, single constructor "library" that will let you create cross-window/tab sync-able objects. It makes use of modern features such as `Object.observe` and `BroadcastChannel` so there are no guarantees it will work everywhere, but it uses polyfills to work in current Chrome, Firefox, and Safari.

## Usage

`CrossTalk([obj], chan, [handler])`

| Argument | Type     | Details                                                                                                                      |
|----------|----------|------------------------------------------------------------------------------------------------------------------------------|
| obj      | Object   | *optional* object that will become a crosstalk object                                                                        |
| chan     | String   | *required* string, naming the channel that the object will talk over                                                         |
| handler  | Function | *optional* function, accepting one argument - the newly changed object. This function will be called when the object changes | 

Ensure you have added the `crosstalk.min.js` script, then you can create an object by passing in an object, the name of the channel it will use, and a function that will be run whenever the object is changed. Every object created should use a unique name, otherwise the objects will conflict and update other objects that aren't their cross-window/tab counterparts. Using the `new` keyword is not necessary, but you may use it if you wish.

``` javascript
var changeHandler = function(changed){
  console.log('Here is the new object: ', changed);
}

var foo = CrossTalk({
  first: 'Morty',
  last: 'Sanchez'
}, 'fooChan', changeHandler);
```

When a new window is opened on the same domain, running the same script, any objects created that share a channel will become synced, adopting the state of the "oldest" object. In our example, this means that the `foo` object will be available in the new window, and when it is changed from either window 

``` javascript
foo.first = 'Rick';
foo.catchPhrase = 'wubba lubba dub dubs'; 
// foo will reflect the new and updated properties in other windows and 
// the handler will be executed in the listening window
```

Depending on your needs, you may only want the handler to execute in one of the windows. This is entirely possible by conditionally instantiating the object, for example:

``` javascript
// this will happen in window one
var foo = CrossTalk({
  first: 'Morty',
  last: 'Sanchez'
}, 'fooChan', changeHandler);


// this will happen in window two
var foo = CrossTalk('fooChan');
```

In this scenario, `changeHandler` will only be executed when changes occur in window two. The underlying data however will continue to stay in sync.
