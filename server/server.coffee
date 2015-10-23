App = require('./engine/engine')

App.appHttp.listen(8000, ->
  console.log('listening on', 8000)
)
