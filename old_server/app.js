/** User Defined */
Models.User   = constructModel('User', 'fab.user')
Models.Admin  = constructModel('Admin', 'fab.admin')

engine.add(Models.User.authenticate)
engine.add(Models.User.isAdmin)

engine.routes = {
  '/':      {method: 'get', file: 'index.html'},
  '/login': {method: 'get', file: 'login.html'}
}