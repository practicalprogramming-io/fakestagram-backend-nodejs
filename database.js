'use strict'


var bcrypt = require('bcrypt')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , save = bookshelf.Model.prototype.save
  , Users
  , Content
  , UsersContent
  , Tags
  , ContentTags
  , Comments
  , UsersFollowers
  , Messages
  , UsersMessages


bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model
  })
}

Users = bookshelf.Model.extend({
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
})

Content = bookshelf.Model.extend({
  tableName: 'content',
  idAttribute: 'content_id',
  user: function () {
    return this.belongsTo(Users, 'users_id')
  },
  comments: function () {
    return this.hasMany(Comments, 'content_id')
  }
})

UsersContent = function (username, content) {
  var query = knex('content')
    .join('users', 'content.users_id', '=', 'users.users_id')
    .where('users.username', '=', username)
    .andWhere('content.name', '=', content)
  return query
}

Tags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id',
  content: function () {
    return this.hasMany(Content, 'tags_id')
  }
})

ContentTags = bookshelf.Model.extend({
  tableName: 'content_tags',
  idAttribute: 'content_tags_id',
  tags: function () {
    return this.hasMany(Tags, 'tags_id')
  }
})

Comments = bookshelf.Model.extend({
  tableName: 'comments',
  idAttribute: 'comments_id',
  content: function () {
    return this.belongsTo(Content, 'content_id')
  }
})

UsersFollowers = bookshelf.Model.extend({
  tableName: 'users_followers',
  idAttribute: 'users_followers_id',
  followers: function () {
    return this.hasMany(Users, 'users_id')
  },
  following: function () {
    return this.hasMany(Users, 'follow_users_id')
  }
})

Messages = bookshelf.Model.extend({
  tableName: 'messages',
  idAttribute: 'messages_id',
  users: function () {
    return this.belongsTo(Users, 'users_id')
  }
})

UsersMessages = bookshelf.Model.extend({
  tableName: 'users_messages',
  idAttribute: 'users_messages_id',
  users: function () {
    return this.belongsTo(Users, 'users_id')
  },
  messages: function () {
    return this.belongsTo(Messages, 'messages_id')
  }
})

module.exports = {
  Users: Users,
  Content: Content,
  UsersContent: UsersContent,
  Tags: Tags,
  ContentTags: ContentTags,
  Comments: Comments,
  UsersFollowers: UsersFollowers,
  Messages: Messages,
  UsersMessages: UsersMessages
}
