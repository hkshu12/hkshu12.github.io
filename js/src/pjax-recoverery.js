console.log('im on fire!!!!')

$('a').addClass('yui3-pjax')
YUI().use('pjax', function(Y) {
  new Y.Pjax({
    container: '#yuipjax',
    addPjaxParam: false
  })
})
if (!document.getElementById('music163player')) {
  el = document.getElementById('music163container')
  el.innerHTML =
    '<iframe id="music163player" frameborder="no" border="0" marginwidth="0" marginheight="0" width="300" height="86" src="//music.163.com/outchain/player?type=2&id=441491915&auto=0&height=66"></iframe>'
}

nav_fix()
posts_fix()

function nav_fix() {
  console.log('nav_fix executed!')
}

function posts_fix() {
  $('.post-block').css({ opacity: 1 })
  $('.post-header').css({ opacity: 1 })
  $('.post-body').css({ opacity: 1 })
  console.log('posts_fix executed!')
}
