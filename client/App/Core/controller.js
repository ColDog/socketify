import user from 'user';

class Controller {
  constructor(opts = {}) {
    this.name       = opts['name']                // controller name to be used on the server
    this.updatesTo  = (opts['updatesTo'] || {})   // methods to be called when new data is recieved for an action
    this.errorsTo   = (opts['errorsTo']  || {})   // methods to be called when there is an error
    this.queries    = (opts['queries'] || {})     // a cache of queries called when the server says data has been updated

    /** Server Notifies of an Update
     * When the application tells us a record has been updated,
     * we check if it affects our model, then we run through and
     * call the queries and their callbacks again. */
    var self = this;
    socket.on('update', function(info){
      console.log('recieved update', info)
      if (info.controller === self.name) {        // if controller name that was updated is this controller's name
        for (var act in self.queries) {           // loop through and call queries
          if (self.queries.hasOwnProperty(act)) {

            var par = self.queries[act]           // the parameters
            // a 'get everything' query, or a 'where' query, or the query matches the
            // parameters in the cached query.
            // todo fix the last part
            if (par === null || info.query === par || typeof par === 'object') {
              self.emit({action: act, params: par, cache: false})
            }

          }
        }
      }
    })

  }

  /** Server Post Request Through Websockets
   * The main emitter caches queries that should be cached so they can be rerun when
   * updates occur, and then sends a message to the server with the controller name, the action
   * any parameters and the authentication information.
   *
   * Upon response the onUpdate method is called set in the configuration earlier. Likely this
   * will be used to change the state of your React model to the new data recieved. */
  emit(opts) {
    var self = this;
    return new Promise(
      function(resolve, reject){
        console.log('emitting', opts)
        var act         = (opts['action'] || '');
        var par         = (opts['params'] || {});
        var cache       = (opts['cache'] || false);
        var respond     = (opts['respond'] || true);
        var token       = (opts['token'] || user().token);
        var controller  = (opts['controller']  || self.name);
        if (cache) { self.queries[act] = par }                // if is a reader request, cache the query

        socket.request({
          controller: controller,
          action: act,
          params: par,
          token: token,
          respond: respond
        }, function(data){
          // Automatically update user data if its present in the request
          if (data.authenticated === false) { // logout if not authenticated
            user().logout()
          }
          if (data.user) { // login if we have user data (will be null if unauthenticated)
            user(data)
          }

          if (data.error) {
            if (typeof self.errorsTo[act] === 'function') {
              self.errorsTo[act](data);    // if a callback for action is present use it
            }
            reject(data)                    // reject the promise

          } else {
            console.log('self', self, self.updatesTo)
            if (typeof self.updatesTo[act] === 'function') {
              console.log('updating with updated to')
              self.updatesTo[act](data)     // if a callback for the action is present use it
            }
            resolve(data)                   // resolve the promise

          }
        });

      }
    )
  }

  /** Helper functions with default settings
   * Writer functions never cache the query (causes infinite loop since backend
   * sends an update event after an action writes to the database) */

  // Reader functions always cache the query
  show(id)    { return this.emit({action: 'show', params: {id: id}, cache: true }) }
  where(pars) { return this.emit({action: 'where', params: pars, cache: true }) }
  all()       { return this.emit({action: 'all', params: {}, cache: true }) }

  // Writer functions never cache the query
  create(pars){ return this.emit({action: 'create', params: pars, cache: false }) }
  destroy(id) { return this.emit({action: 'destroy', params: {id: id}, cache: false }) }
  update(pars){ return this.emit({action: 'update', params: pars, cache: false }) }

}

module.exports = Controller
