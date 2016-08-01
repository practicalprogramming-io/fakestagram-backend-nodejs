'use strict'


const bcrypt = require('bcrypt')
const config = require('./config.json')
const knex = require('knex')(config.db)
const bookshelf = require('bookshelf')(knex)
const jwt = require('jsonwebtoken')
const save = bookshelf.Model.prototype.save


bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model
  })
}

const Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'users_id',
  generateHash: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  },
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'))
  },
  generateJWT: function () {
    var expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)
    return jwt.sign({
      _id: this.users_id,
      email: this.email,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000)
    }, config.jwtSecret)
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

const Content = bookshelf.Model.extend({
  tableName: 'content',
  idAttribute: 'content_id',
  user: function () {
    return this.belongsTo(Users, 'users_id')
  },
  comments: function () {
    return this.hasMany(Comments, 'content_id')
  }
})

const UsersContent = function (username, content) {
  var query = knex('content')
    .join('users', 'content.users_id', '=', 'users.users_id')
    .where('users.username', '=', username)
    .andWhere('content.name', '=', content)
  return query
}

const Tags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id',
  content: function () {
    return this.hasMany(Content, 'tags_id')
  }
})

const ContentTags = bookshelf.Model.extend({
  tableName: 'content_tags',
  idAttribute: 'content_tags_id',
  tags: function () {
    return this.hasMany(Tags, 'tags_id')
  }
})

const Comments = bookshelf.Model.extend({
  tableName: 'comments',
  idAttribute: 'comments_id',
  content: function () {
    return this.belongsTo(Content, 'content_id')
  }
})

const UsersFollowers = bookshelf.Model.extend({
  tableName: 'users_followers',
  idAttribute: 'users_followers_id',
  followers: function () {
    return this.hasMany(Users, 'users_id')
  },
  following: function () {
    return this.hasMany(Users, 'follow_users_id')
  }
})

const Messages = bookshelf.Model.extend({
  tableName: 'messages',
  idAttribute: 'messages_id',
  users: function () {
    return this.belongsTo(Users, 'users_id')
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
  Bookshelf: bookshelf
}
