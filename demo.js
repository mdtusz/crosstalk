// (function () {
//   'use strict';

var md = window.markdownit();
var text = new CrossTalk('editorChannel');

var preview = document.getElementById('preview');
var editor = document.getElementById('editor');

setTimeout(function () {
  console.log(text.getInstance());
  if (text.getInstance() % 2 === 0) {
    // Preview window(s)
    preview.setAttribute('class', '');

    text.setHandler(function (data) {
      // Update markdown preview.
      console.log('Change handler fired!');
    });
  } else {
    // Editor window
    editor.setAttribute('class', '');
  }
}, 200);


var markdown = document.getElementById('markdown');

console.log(md.render('# Hello World'));
// })();