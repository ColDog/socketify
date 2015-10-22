function constructModel(collection, name) {
  var Model = {}
  Model.collection = collection
  Model.name = name
  Model.db = db(name)
  Model.permissions = {
    create:   function(req)  { return true },
    update:   function(req)  { return true },
    destroy:  function(req)  { return true },
    find:     function(req)  { return true },
    all:      function(req)  { return true }
  }

  Model.checkPermissions = function(action, req) {
    if (!Model.permissions[action](req)) { throw 'Access Denied' }
  }

  Model.all = function(req, res, next) {
    Model.checkPermissions('all', req)
    Model.db.find({}, function(reply){
      res.res = reply.documents
      res.success = true
      next()
    })
  }
  Model.find = function(req, res, next) {
    Model.checkPermissions('find', req)
    Model.db.find({_id: req.params._id}, function(reply){
      res.res = reply.documents[0]
      res.success = true
      next()
    })
  }
  Model.find_by = function(req, res, next) {
    Model.checkPermissions('find', req)
    Model.db.find({_id: req.params}, function(reply){
      res.res = reply.documents[0]
      res.success = true
      next()
    })
  }
  Model.create = function(req, res, next) {
    req.emitter.emit('update', Model.collection)
    Model.checkPermissions('create', req)
    Model.db.insert(req.params)
    res.success = true
    res.msg =  Model.collection+ ' created.'
    next()
  }
  Model.update = function(req, res, next) {
    req.emitter.emit('update', Model.collection)
    Model.checkPermissions('update', req)
    Model.db.save(req.params)
    res.success = true
    res.msg =  Model.collection+ ' updated.'
    next()
  }
  Model.destroy = function(req, res, next) {
    req.emitter.emit('update', Model.collection)
    Model.checkPermissions('destroy', req)
    Model.db.remove(req.params._id)
    res.success = true
    res.msg =  Model.collection+ ' deleted.'
    next()
  }
  Model.register = function(req, res, next) {
    console.log('req', req)
    console.log('res', res)
    var user = req.params
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash
        Model.db.insert(user)
        req.user = user
        req.user.authenticated = true
        var token = jwt.sign(user, secret, { expiresIn: 604800 } )
        res = _.extend(res, { success: true, msg: 'Successfully logged in', token: token, user: user } )
        next()
      })
    })
  }

  Model.login = function(req, res, next) {
    next()
  }

  Model.authenticate = function(req, res, next) {
    var token = req.token
    var email = req.params.email
    var candidate = req.params.password
    if (email && candidate) {
      Models.User.db.find({email: email}, function(reply) {
        var user = reply.documents[0]
        if (user) {
          bcrypt.compare(candidate, user.password, function(err, isMatch) {
            if (err) {
              req.user = { authenticated: false }
              res.authenticated = false
              res.msg = 'Failed to log in'
              next()
            } else {
              req.user = user
              req.user.authenticated = true
              var token = jwt.sign(user, secret, { expiresIn: 604800 } )
              res = _.extend(res,
                { authenticated: true, msg: 'Successfully logged in', token: token, user: user }
              )
              next()
            }
          })
        } else {
          req.user = { authenticated: false }
          res.authenticated = false
          res.msg = 'Failed to log in'
          next()
        }
      })
    } else if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          req.user.authenticated = false
          res.msg = err
          next()
        } else {
          decoded.authenticated = true
          req.user = decoded
          res.msg = err
          next()
        }
      });
    } else {
      next()
    }
  }

  Model.isAdmin = function(req, res, next) {
    if (req.user && req.user._id) {
      Models.Admin.db.find({userId: req.user._id}, function(reply) {
        if (reply.documents[0]) {
          req.isAdmin = true
          next()
        }
      })
    }
    req.isAdmin = false
    next()
  }



  return Model
}

module.exports = constructModel