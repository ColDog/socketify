User = constructModel('User')

App.router
  .add({path: '/', template: 'home'}, function(params){
    User.all({}, function(reply){
      App.users = reply.data.res
      App.events.emit('render')
    })
  })
  .add({path: '/users/:id', template: 'users.show'}, function(params){
    User.find(params.id, function(reply){
      App.user = reply.data.res
      App.events.emit('render')
    })
  })


// Page scripts held within app ready so dom content is loaded
App.events.on('app-ready', function(){
  document.getElementById('menu-toggle').addEventListener('click', function(){
    document.getElementById('wrapper').classList.toggle('toggled');
  })
})
