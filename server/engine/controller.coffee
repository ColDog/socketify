class Controller
  constructor: (model, authenticated_routes) ->
    @model = model
    @authenticated_routes = (authenticated_routes || {show: true, all: true, create: true, update: true, destroy: true} )

  show: (req, res, next) ->
    if @authenticated_routes['show'] and not req.authenticated
      next()

    @model.findById(req.params.id).then((rec)->
      res.data = rec
      next()
    )

  all: (req, res, next) ->
    if @authenticated_routes['all'] and not req.authenticated
      next()

    @model.find().then((rec) ->
      res.data = rec
      next()
    )

  create: (req, res, next)->
    if @authenticated_routes['create'] and not req.authenticated
      next()

    @model.create(req.params).then((rec)->
      res.data = rec
      next()
    )

  update: (req, res, next) ->
    if @authenticated_routes['update'] and not req.authenticated
      next()

    @model.findById(req.params.id).then((rec) ->
      rec.update(req.params).then((updated) ->
        res.data = updated
        next()
      )
    )

  destroy: (req, res, next) ->
    if @authenticated_routes['destroy'] and not req.authenticated
      next()

    @model.findById(req.params.id).then((rec)->
      rec.destroy().then((destroyed)->
        res.data = destroyed
        next()
      )
    )

module.exports = Controller
