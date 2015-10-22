/** Default User Object */
App.user = function() {
  var expires = localStorage.getItem('fabexpires')
  var valid = Math.floor(expires) > Math.floor(new Date() / 1000)
  var token = localStorage.getItem('fabtoken')
  return {
    token: token,
    email: localStorage.getItem('fabemail'),
    name: localStorage.getItem('fabname'),
    _id: localStorage.getItem('fabid'),
    expires: expires,
    valid: valid,
    loggedIn: valid && token
  }
}

App.createLocalUser = function(data) {
  localStorage.setItem('fabtoken', data.token)
  localStorage.setItem('fabemail', data.user.email)
  localStorage.setItem('fabname', data.user.name)
  localStorage.setItem('fabid', data.user._id)
  localStorage.setItem('fabexpires', data.user.exp)
}

App.logout = function() {
  localStorage.removeItem('fabtoken')
  localStorage.removeItem('fabemail')
  localStorage.removeItem('fabname')
  localStorage.removeItem('fabexpires')
  App.router.redirect('/')
}

//App.loggedIn = function() {
//  App.user().expires
//}
