'use strict'


const database = require('./database')
const jwt = require('jsonwebtoken')
const localStrategy = require('passport-local').Strategy


module.exports = function (passport, config) {

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
            let token = user.generateJWT()
            return callback(null, token, user)
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
        let token = user.generateJWT()
        console.log(token)
        console.log(user)
        return callback(null, token, user)
      })
      .catch(function (error) {
        return callback(error)
      })
  }

}
