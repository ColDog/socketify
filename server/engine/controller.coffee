module.exports = (model, App, name)->
  cntrl = {}
  cntrl.model = model   # model that will be used for all the routes
  cntrl.name = name     # name that will be sent with the update emit message

  cntrl.show = (req, res, next) ->
    cntrl.model.findById(req.params.id).then((rec)->
      res.data = rec
      next()
    )

  cntrl.all = (req, res, next) ->
    cntrl.model.findAll({}).then((rec) ->
      res.data = rec
      next()
    )

  cntrl.create = (req, res, next)->
    cntrl.model.create(req.params).then((rec)->
      res.data = rec
      App.updates.emit('new', cntrl.name)
      next()
    )

  cntrl.update = (req, res, next) ->
    cntrl.model.findById(req.params.id).then((rec) ->
      rec.update(req.params).then((updated) ->
        res.data = updated
        App.updates.emit('new', cntrl.name)
        next()
      )
    )

  cntrl.destroy = (req, res, next) ->
    cntrl.model.findById(req.params.id).then((rec)->
      rec.destroy().then((destroyed)->
        res.data = destroyed
        App.updates.emit('new', cntrl.name)
        next()
      )
    )

  return cntrl
