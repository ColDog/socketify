/** Event Handling:
 * Can safely just match the url constantly, and the logic will figure out
 * what to do from there. If the urls already match and the templates have
 * been rendered nothing will happen.
 *
 * The render event is for any changes in data which will not affect the url.
 * this will not match routes at all, but simply re render the page with the
 * model data.
 * */
App.events.on('render', function()    { App.router.render() })
App.events.on('url change', function(){ App.router.match()  })

/** Create Events */
window.onpopstate = function(){ App.events.emit('url change') }
$(document).ready( function() { App.events.emit('url change') })


document.addEventListener('click', function(evt) {
  var element = evt.target || evt.srcElement
  if (element.tagName === 'A') {
    evt.preventDefault()
    go(element.href)
  }
})

$(document).submit(function(e){
  console.log('form submitted')
  var element = e.target || e.srcElement

  if (App.forms[element.id]) {
    console.log('form submitted')
    e.preventDefault()
    App.forms[element.id]( $(element).serializeObject() )
  } else {
    console.warn('no handler attached to', element.id)
  }
})
