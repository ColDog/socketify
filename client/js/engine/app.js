/** Useful Functions
 */
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else { o[this.name] = this.value || '';
    }
  });
  return o;
};

function genId() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

function go() {
  App.router.go(App.path(arguments))
}

function flash(msg, cls) {
  var type = (cls || 'success')
  var ht =  '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      msg +
  '</div>'
  $('#flash').html(ht)
  $('#flash').slideDown('slow').delay(2000).slideUp('slow')
}


/** App
 * Main singleton method. Entire object is passed into template rendering
 */
App = {}
App.forms = {}
App.events = new Evemit()

/** App.render
 *  First load the main template on every page with id="main"
 *  then load the page specific template defined in the routes.
 *
 *  todo set up a watcher that can actually decide which parts need to be reloaded
 *  todo set up unlimited template rendering? or inline re-rendering
 */
App.render = function(template) {
  console.log('render called', 'template:', template)
  var ren = function(temp) { return ejs.render( _.unescape( document.getElementById(temp).innerHTML ), App ) }
  var ins = function(id, html)  { document.getElementById(id).innerHTML = html }

  ins('page', ren('main'))
  if (!document.getElementById(template)) {
    console.warn('Cannot find template')
  } else {
    ins('page-template', ren(template))
  }

  App.events.emit('app-ready')
}

/** App.insert
 *  Since render only loads 1 page specific template, this insert
 *  function can be used inside the ejs to render another template
 *  inline.
 */
App.insert = function(target){
  var html = _.unescape( document.getElementById(target).innerHTML )
  return ejs.render(html, App)
}

/** App.path
 *  Path helping function
 */
App.path = function() {
  var args = Array.prototype.slice.call(arguments)
  if (args.length === 1) {
    var path = args[0]
    if (typeof path === 'string' && path.indexOf('/') === 0) {
      return path
    } else if (typeof path === 'string') {
      return '/' + path
    }
  } else {
    return '/' + args.join('/')
  }
}
