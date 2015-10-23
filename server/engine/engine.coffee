App = {}
App.express         = require('express')
App.app             = App.express()
App.appHttp         = require('http').Server(App.app)
App.jwt             = require('jsonwebtoken')
App.bcrypt          = require('bcrypt')
App.io              = require('socket.io')(App.appHttp)
App._               = require('underscore')
App.Sequelize       = require('sequelize')
db_config           = require('../config/db.json')

# Events
EventEmitter = require('events').EventEmitter
App.updates = new EventEmitter();

# ==> Models and Database
# set configuration in server/config/db.json
if (db_config['sequelize']['use']) {
  App.sequelize = new App.Sequelize(
    db_config['sequelize']['name'],
    db_config['sequelize']['username'],
    db_config['sequelize']['password'], {
      host:     db_config['host'],
      dialect:  db_config['adapter'],
      pool: { max: 5, min: 0, idle: 10000 }
    }
  )
}
if (db_config['mongo']['use']) {
  App.mongo = require('mongous')
}
if (db_config['redis']['use']) {
  App.redis = require('redis').createClient()
}

require('../app/models')(App)       # requires all models and loads them into App
App.sequelize.sync()                # syncs all models which aren't in the database

# ==> Middleware and Controllers
App.BaseController = require('./controller')
require('../app/controllers')(App)  # adds controllers into the app
require('../app/middleware')(App)   # adds user defined middleware
require('./middleware')(App)        # adds middleware functions to the App
App.app.use(App.httpMiddleware)     # adds middleware to express

# ==> Sockets
App.socketUsers = {}
require('./sockets')(App)           # adds socket callbacks to App

module.exports = App
