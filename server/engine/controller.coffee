module.exports = (App) ->
  App.Controllers = {}  # This is where all the user defined controllers will go

  # this Base controller can be extended to easily match
  # up with client side default routing. It simply provides
  # the basic CRUD functions expected in any API.
  App.BaseController = (model, name) ->
    cntrl = {}
    cntrl.model = model
    cntrl.name  = name

    cntrl.show = (req, res, next)->
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
        console.log(Date.now(), 'create')
        App.io.emit('update', {
          controller: cntrl.name, query: req.params
        })
        next()
      )

    cntrl.update = (req, res, next) ->
      cntrl.model.findById(req.params.id).then((rec) ->
        rec.update(req.params).then((updated) ->
          res.data = updated
          App.io.emit('update', {
            controller: cntrl.name, query: req.params
          })
          next()
        )
      )

    cntrl.destroy = (req, res, next) ->
      cntrl.model.findById(req.params.id).then((rec)->
        rec.destroy().then((destroyed)->
          res.data = destroyed
          App.io.emit('update', {
            controller: cntrl.name, query: req.params
          })
          next()
        )
      )
    return cntrl
