# Base methods and utility functions useful for any project
# Includes user registration and Authorization functions
# Assumes an App.User Model.
module.exports = (App) ->
  App.methods = {

    register: (req, res, next)->
      user = req.params  # creates a user object from the parameters
      App.bcrypt.genSalt(10, (err, salt)-> # generates salt
        if not err
          App.bcrypt.hash(user.password, salt, (err, hash)-> # get hashed pass
            if not err
              user.password = hash  # replace the password with the hashed password

              # create the user and add to the request
              # todo must use the App.User instance?
              App.User.create(user).then((instance)->
                req.user = instance
                res.user = instance
                req.authenticated = true
                res.authenticated = true
                res.token = App.jwt.sign(instance, App.secret, {expiresIn: 604800})
                res.expiry = Math.floor(new Date() / 1000) + 604800
                next()
              )
            else
              req.user = null
              res.user = null
              req.authenticated = false
              res.authenticated = false
              next()

          )
        else
          req.user = null
          res.user = null
          req.authenticated = false
          res.authenticated = false
          next()
      )

    authenticate: (req, res, next) ->
      token = req.token
      email = req.params.email
      candidate = req.params.password

      if email && candidate # authenticate with email or password as well as a token next
        App.User.findOne({email: email}).then((user)->
          if user
            App.bcrypt.compare(candidate, user.password, (err, match)->
              if (err)
                req.user = null
                res.user = null
                req.authenticated = false
                res.authenticated = false
                next()
              else
                req.user = user
                res.user = user
                req.authenticated = true
                res.authenticated = true
                res.token = App.jwt.sign(user, App.secret, {expiresIn: 604800})
                res.expiry = Math.floor(new Date() / 1000) + 604800
                next()
            )
          else
            req.user = null
            res.user = null
            req.authenticated = false
            res.authenticated = false
            next()
        )
      else if token # verifying by token
        App.jwt.verify(token, App.secret, (err, decoded)->
          if err
            req.user = null
            res.user = null
            req.authenticated = false
            res.authenticated = false
            next()
          else
            req.user = decoded
            res.user = decoded
            req.authenticated = true
            res.authenticated = true
            next()
        )
      else  # can't find a password email or token
        req.user = null
        res.user = null
        req.authenticated = false
        res.authenticated = false
        next()

  }

