module.exports = (App) ->
  App.User = App.sequelize.define('user', {
    name: { type: App.Sequelize.STRING }
    email: { type: App.Sequelize.STRING }
    password_digest: { type: App.Sequelize.STRING }
  })

  App.Comments = App.sequelize.define('comments', {
    name: { type: App.Sequelize.STRING }
    content: { type: App.Sequelize.STRING }
  })


