hexo.extend.helper.register('simpleFormat', function(content = ""){
  return '<p>' + content.replace(/\n/g, '</p><p>') + '</p>';
});
