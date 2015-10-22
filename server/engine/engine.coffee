App = {}
App.express         = require('express')
App.app             = App.express()
App.appHttp         = require('http').Server(App.app)
App.jwt             = require('jsonwebtoken')
App.bcrypt          = require('bcrypt')
App.io              = require('socket.io')(App.appHttp)
App._               = require('underscore')
App.redis           = require('redis').createClient()
App.Sequelize       = require('sequelize')
App.mongo           = require('mongous')
db_config           = require('../config/db.json')

# ==> Models and Database
App.sequelize = new App.Sequelize(db_config['name'], db_config['username'], db_config['password'], {
  host:     db_config['host'],
  dialect:  db_config['adapter'],
  pool: { max: 5, min: 0, idle: 10000 },
})

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