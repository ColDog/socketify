/** Router
 *  Strategy: define 1 template for each route which is rendered
 *  after a function is called.
 *
 *  First we will match the urls, then the user defined function
 *  will prepare the data and call render once the data is ready.
 *  Users function must call render!!
 */
App.router = {
  current: '',
  routes: [],
  root: '/',
  template: '',
  path: function () {
    return window.location.pathname
  },
  params: function () {
    _.chain(location.search.slice(1).split('&'))
      .map(function (item) {
        if (item) return item.split('=');
      })
      .compact()
      .object()
      .value();
  },
  back: function () {
    history.pushState(null, null, document.referrer)
  },
  render: function() {
    console.log('this.template =', App.router.template )
    App.render(this.template)
  },
  add: function(pars, func) {
    this.routes.push({path: pars.path, func: func, params: pars.params, template: pars.template})
    return this
  },
  redirect: function (route) {
    window.location = route
  }
}

App.router.checkRoutes = function(path){
  var match = true
  var params = {}
  var chosen = null

  for (var route = 0; route < this.routes.length; route++) {
    var candidate = true
    var pars = {}
    var r = this.routes[route].path.split('/')
    var p = path.split('/')

    for (var i = 0; i < r.length; i ++) {
      if (r[i].indexOf(':') !== -1) {
        pars[r[i].split(':')[1]] = p[i]
      } else if (r[i] !== p[i]) {
        candidate = false
        break
      }
    }

    match = candidate
    if (match) { params = pars ; chosen = this.routes[route] ; break }
  }

  if (match) {
    return {
      params: params,
      route: chosen
    }
  } else {
    return false
  }
}

// Go checks for the route in the system.
// if it is in the system, we change the url
// and then emit a url change to trigger the router.
App.router.go = function(route) {
  if (App.router.checkRoutes(route)) {
    history.replaceState({}, null, route)
    App.events.emit('url change')
  } else {
    App.router.redirect(route)
  }
}

// match is the main function that will map to the corresponding routes
// it also does the work of calling the necessary function and then
// also calling render.
App.router.match = function () {
  console.log('matching..')
  if (App.router.current === App.router.path()) {
    console.log('is current')
    return
  }

  if (this.routes.length == 0) {
    console.log('no routes')
    return
  }

  var match = App.router.checkRoutes(App.router.path())
  // if we have a match, run the function and render
  if (match) {
    App.router.current = App.router.path()
    console.log('match:', match.route.template, match.route.path, 'calling function...')
    App.router.template = match.route.template
    // call the routes function with all of the params
    match.route.func( _.extend(match.route.params, App.router.params()) )
  } else {
    console.warn('could not find match')
    // if we cant find a match at least render the base template
    App.router.render()
  }
}