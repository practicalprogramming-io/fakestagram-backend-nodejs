'use strict'


var database = require('./database')
  , localStrategy = require('passport-local').Strategy


module.exports = function (passport) {

  passport.serializeUser(function (user, callback) {
    return callback(null, user.id)
  })

  passport.deserializeUser(function (userId, callback) {
    new database.Users({users_id: userId})
      .fetch()
      .then(function (user) {
        return callback(null, user)
      })
      .catch(function (error) {
        return callback(error)
      })
  })

  passport.use('register',
    new localStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    }, register))

  passport.use('login',
    new localStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    }, login))


  function register (req, username, password, callback) {
    new database.Users({username: username})
      .fetch()
      .then(function (user) {
        if (user) return callback("User exists")
        var self = this
          , data = {
            username: username,
            email: req.body.email,
            password: this.generateHash(password),
            bio: req.body.bio ? req.body.bio : ''
          }
        new database.Users(data)
          .save()
          .then(function (user) {
            return callback(null, user)
          })
          .catch(function (error) {
            return callback(error)
          })
      })
      .catch(function (error) {
        return callback(error)
      })
  }

  function login (req, username, password, callback) {
    new database.Users({username: username})
      .fetch()
      .then(function (user) {
        if (!user) return callback("User does not exist")
        if (!user.validPassword(password)) return callback("Incorrect")
        return callback(null, user)
      })
      .catch(function (error) {
        return callback(error)
      })
  }

}
