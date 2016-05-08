var bcrypt = require('bcrypt-nodejs')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(kenx)
  , save = bookshelf.Model.prototype.save
  , Users
  , Content
  , Tags
  , ContentTags
  , UsersFollowers
  , UsersBlocked
  , Messages
  , UsersMessages


bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model
  })
}

module.exports = {

  Users: bookshelf.Model.extend({
    tableName: 'users',
    idAttribute: 'users_id',
    generateHash: function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    },
    validPassword: function (password) {
      return bcrypt.compareSync(password, this.get('password'))
    },
    content: function () {
      return this.hasMany(Content, 'users_id')
    },
    blocked: function () {
      return this.hasMany(UsersBlocked, 'users_blocked_id')
    },
    messagesSent: function () {
      return this.hasMany(Messages, 'sender_id')
    },
    messagesReceived: function () {
      return this.hasMany(Messages, 'receiver_id')
    },
    followers: function () {
      return this.hasMany(UsersFollowers, 'users_id')
    },
    following: function () {
      return this.hasMany(UsersFollowers, 'followers_id')
    }
  }),

  Content: bookshelf.Model.extend({
    tableName: 'content',
    idAttribute: 'content_id',
    user: function () {
      return this.belongsTo(Users, 'users_id')
    }
  }),

  Tags: bookshelf.Model.extend({
    tableName: 'tags',
    idAttribute: 'tags_id',
  }),

  ContentTags: bookshelf.Model.extend({
    tableName: 'content_tags',
    idAttribute: 'content_tags_id',
    tags: function () {
      return this.hasMany(Tags, 'tags_id')
    }
  }),

  UsersFollowers: bookshelf.Model.extend({
    tableName: 'users_followers',
    idAttribute: 'users_followers_id',
  }),

  UsersBlocked: bookshelf.Model.extend({
    tableName: 'users_blocked',
    idAttribute: 'users_blocked_id',
  }),

  Messages: bookshelf.Model.extend({
    tableName: 'messages',
    idAttribute: 'messages_id',
  }),

  UsersMessages: bookshelf.Model.extend({
    tableName: 'users_messages',
    idAttribute: 'users_messages_id',
  })

}
