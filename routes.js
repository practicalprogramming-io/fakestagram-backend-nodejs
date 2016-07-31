'use strict'


  var config = require('./config.json')
    , path = require('path')
    , knex = require('knex')
    , Promise = require('bluebird')


module.exports = function (db) {

  return {

    getUser: function (req, res, next) {
      var username = req.params.username
      new db.Users({ username: username })
        .fetch({ withRelated: ['content'] })
        .then(function (model) {
          if (!model) return res.status(404)
          return res.status(200).send(model.toJSON())
        })
        .catch(function (error) {
          return res.status(500).send(error)
        })
    },

    postContent: function (req, res, next) {
      var contentData = {
        "users_id": req.user.attributes.users_id,
        "size": req.file.size,
        "original_name": req.file.originalname,
        "name": req.file.filename,
        "location": req.file.path,
        "upload_ip": req.connection.remoteAddress
      }
      new db.Content(contentData)
        .save()
        .then(function (model) {
          return res.status(200).send({
            "name": model.get('name'),
            "users_id": model.get('users_id')
          })
        })
        .catch(function (error) {
          return res.status(500).send(error)
        })
    },

    getContent: function (req, res, next) {
      var content = req.params.content_guid
        , username = req.query.takenby
        , query = db.UsersContent(username, content)

      query.asCallback(function (error, data) {
        if (error) return res.status(500).send(error)
        new db.Content({ content_id: data[0].content_id })
          .fetchAll({ withRelated: ['comments'] })
          .then(function (model) {
            return res.status(200).send(model.toJSON())
          })
          .catch(function (error) {
            return res.status(500).send(error)
          })
      })
    },

    postComment: function (req, res, next) {
      var content = req.params.content_guid
        , username = req.query.takenby
        , query = db.UsersContent(username, content)

      query.asCallback(function (error, data) {
        if (error) return res.status(500).send(error)
        var commentData = {
          "users_id": req.user.id,
          "content_id": data[0].content_id,
          "comment": req.body.comment
        }
        new db.Comments(commentData)
          .save()
          .then(function (model) {
            return res.sendStatus(200)
          })
          .catch(function (error) {
            return res.status(500).send(error)
          })
      })
    },

    getMessage: function (req, res, next) {
      var messagesId = req.params.messages_id ? req.params.messages_id : null
        , user = req.user.attributes.users_id
      if (!messagesId) {
        db.Messages.forge()
          .where('sender_id', '=', user, 'or', 'receiver_id', '=', user)
          .orderBy('-read')
          .fetchAll()
          .then(function (model) {
            return res.status(200).send(model.toJSON())
          })
          .catch(function (error) {
            return res.status(500).send(error)
          })
      }
      else {
        db.UsersMessages.forge({messages_id: messagesId})
      }
    },

    postMessage: function (req, res, next) {

      function createMessage () {
        return db.Bookshelf.transaction(function (t) {
          var sendUser = req.user.attributes.users_id
            , message = req.body.message
            , receiveUser
            , messages

          receiveUser = db.Users.forge({ username: req.body.receive_user })
            .fetch({ require: true, transacting: t })
            .call('get', 'users_id')

          messages = receiveUser.then(function (model) {
            var data = {}
            data.sender_id = sendUser
            data.receiver_id = receiveUser.value()
            data.message = message
            data.read = false
            return db.Messages.forge(data).save(null, {transacting: t})
          })

          return messages
        })
        .then(function (model) {
          return Promise.resolve(model)
        })
        .catch(function (error) {
          return Promise.reject(new Error(error))
        })
      }

      createMessage()
        .then(function (model) {
          return res.sendStatus(200)
        })
        .catch(function (error) {
          return res.status(500).send(error)
        })
    }
  }
}
