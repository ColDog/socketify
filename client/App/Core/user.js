module.exports = function(data) {
  // if initialized with an argument, set the localstorage elements
  if (data) {
    localStorage.setItem('fabtoken', data.token)
    localStorage.setItem('fabemail', data.user.email)
    localStorage.setItem('fabname', data.user.name)
    localStorage.setItem('fabid', data.user.id)
    localStorage.setItem('fabexpires', data.expiry)
  }

  var expires = localStorage.getItem('fabexpires')
  var valid = Math.floor(expires) > Math.floor(new Date() / 1000)
  var token = localStorage.getItem('fabtoken')
  return {

    token:    token,
    email:    localStorage.getItem('fabemail'),
    name:     localStorage.getItem('fabname'),
    id:      localStorage.getItem('fabid'),
    expires:  expires,
    valid:    valid,
    loggedIn: valid && token,

    // redirect if not authenticated
    authenticate: function(nextState, transition) {
      if (!valid && token) {
        transition.to('/login')
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
