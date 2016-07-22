'use strict'


  var config = require('./config.json')
    , path = require('path')
    , knex = require('knex')


module.exports = function (database) {

  return {

    getUser: function (req, res, next) {
      var username = req.params.username
      new database.Users({ username: username })
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
      new database.Content(contentData)
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
        , query = database.UsersContent(username, content)

      query.asCallback(function (error, data) {
        if (error) return res.status(500).send(error)
        new database.Content({ content_id: data[0].content_id })
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
        , query = database.UsersContent(username, content)

      query.asCallback(function (error, data) {
        if (error) return res.status(500).send(error)
        var commentData = {
          "users_id": req.user.id,
          "content_id": data[0].content_id,
          "comment": req.body.comment
        }
        new database.Comments(commentData)
          .save()
          .then(function (model) {
            return res.sendStatus(200)
          })
          .catch(function (error) {
            console.log(error)
            return res.status(500).send(error)
          })
      })
    },

    getMessage: function (req, res, next) {

    },

    postMessage: function (req, res, next) {

    }

  }

}
