User = constructModel('User')

App.forms.login = function(data) {
  User.login(data, function(reply){
    if (reply.data.authenticated) {
      flash(reply.data.msg)
      App.createLocalUser(reply.data)
      App.router.redirect('/')
    } else {
      flash(reply.data.msg, 'danger')
    }
  })
}

App.forms.register = function(data) {
  User.register(data, function(reply){
    if (reply.data.success) {
      flash(reply.data.msg)
      App.createLocalUser(reply.data)
      App.router.redirect('/')
    } else {
      flash(reply.data.msg, 'danger')
    }
  })
}