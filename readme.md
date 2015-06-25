# Crosstalk

This is a very small, single constructor "library" that will let you create cross-window/tab sync-able objects. It makes use of `BroadcastChannel` so there are no guarantees it will work everywhere, but it uses a polyfill to work in current Chrome, Firefox, and Safari.

## Usage

`CrossTalk([obj], chan, [handler])`

| Argument | Type     | Details                                                                                                                      |
|----------|----------|------------------------------------------------------------------------------------------------------------------------------|
| obj      | Object   | *optional* object that will become a crosstalk object                                                                        |
| chan     | String   | *required* string, naming the channel that the object will talk over                                                         |
| handler  | Function | *optional* function, accepting one argument - the newly changed object. This function will be called when the object changes | 

Ensure you have added the `crosstalk.min.js` script, then you can create an object by passing in an object, the name of the channel it will use, and a function that will be run whenever the object is changed. Every object created should use a unique name, otherwise the objects will conflict and update other objects that aren't their cross-window/tab counterparts. Using the `new` keyword is not necessary, but you may use it if you wish.

``` javascript
var changeHandler = function(data){
  console.log('Here is the object after a change: ', data);
}

var foo = CrossTalk({
  first: 'Morty',
  last: 'Sanchez'
}, 'fooChan', changeHandler);
```

When a new window is opened on the same domain, running the same script, any objects created that share a channel will become synced, adopting the state of the "oldest" object. In our example, this means that the `foo` object will be available in the new window, and when it is changed from either window 

``` javascript
foo.set('first', 'Rick');
foo.set('catchPhrase', 'wubba lubba dub dubs'); 
// foo will reflect the new and updated properties in other windows and 
// the handler will be executed in the listening window(s)
```

Depending on your needs, you may only want the handler to execute in one of the windows. This is entirely possible by conditionally instantiating the object, for example:

``` javascript

var foo = CrossTalk({
  first: 'Morty',
  last: 'Sanchez'
}, 'fooChan');

if(foo.getInstance() > 0){
  foo.setHandler(function(data){
    console.log('This will not display in the first opened window. Here is the data: ', data);
  });
}
```

In this scenario, `changeHandler` will be applied to all but the first instance of `foo`. It is important to note that the underlying data however will continue to stay in sync.
