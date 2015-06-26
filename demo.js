(function () {
  'use strict';

  var md = window.markdownit();
  var doc = new CrossTalk('editorChannel');

  var preview = document.getElementById('preview');
  var editor = document.getElementById('editor');

  var editToggle = document.getElementById('edit_toggle');
  var previewToggle = document.getElementById('preview_toggle');

  var markdown = document.getElementById('markdown');
  var rendered = document.getElementById('rendered');

  function update() {
    console.log(doc.get('text'));
    markdown.value = doc.get('text');
    rendered.innerHTML = md.render(markdown.value);
    markdown.setAttribute('style', 'height: ' + markdown.scrollHeight + 'px;');
  }

  editToggle.addEventListener('click', function () {
    editToggle.setAttribute('class', 'active');
    editor.setAttribute('class', '');
    previewToggle.setAttribute('class', '');
    preview.setAttribute('class', 'hidden');
  });

  previewToggle.addEventListener('click', function () {
    editToggle.setAttribute('class', '');
    editor.setAttribute('class', 'hidden');
    previewToggle.setAttribute('class', 'active');
    preview.setAttribute('class', '');
  });

  doc.setHandler(function (doc) {
    markdown.value = doc.text;
    rendered.innerHTML = md.render(doc.text);
    markdown.setAttribute('style', 'height: ' + markdown.scrollHeight + 'px;');
  });

  markdown.addEventListener('input', function () {
    markdown.setAttribute('style', 'height: ' + markdown.scrollHeight + 'px;');
    rendered.innerHTML = md.render(doc.set('text', markdown.value));
  });

})();