var foo = CrossTalk({
  first: 'Rick',
  last: 'Sanchez',
  catchPhrase: 'wubba lubba dub dubs'
}, 'crossTalkChannel');
console.log('We\'ve created an object called `foo` that will be available in both windows.');
console.log(' Add, update, and delete properties here, and you\'ll see the changes reflected in the other window too!');
console.log('You can create another crosstalk object here with:');
console.log('%cvar bar = CrossTalk({ hello: "world"}, "fooChan");', 'color: blue;');