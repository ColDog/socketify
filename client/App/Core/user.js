module.exports = function(data) {

  // if initialized with an argument, set the localstorage elements
  if (data) {
    localStorage.setItem('fabtoken', data.token)
    localStorage.setItem('fabemail', data.user.email)
    localStorage.setItem('fabname', data.user.name)
    localStorage.setItem('fabid', data.user._id)
    localStorage.setItem('fabexpires', data.user.exp)
  }

  var expires = localStorage.getItem('fabexpires')
  var valid = Math.floor(expires) > Math.floor(new Date() / 1000)
  var token = localStorage.getItem('fabtoken')
  return {

    token:    token,
    email:    localStorage.getItem('fabemail'),
    name:     localStorage.getItem('fabname'),
    _id:      localStorage.getItem('fabid'),
    expires:  expires,
    valid:    valid,
    loggedIn: valid && token,

    // redirect if not authenticated
    authenticate: function(nextState, replaceState) {
      console.log('authenticated', valid, token)
      if (!(valid && token)) { // redirect if not logged in
        replaceState({ nextPathname: nextState.location.pathname }, '/login')
      }
    },

    // logout a user by removing credentials
    logout: function() {
      localStorage.removeItem('fabtoken')
      localStorage.removeItem('fabemail')
      localStorage.removeItem('fabname')
      localStorage.removeItem('fabexpires')
    }
  }
}
