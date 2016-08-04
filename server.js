'use strict'


const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const multer = require('multer')
const config = require('./config.json')
const database = require('./database')
const routes = require('./routes')(database)
const jwt = require('express-jwt')
const server = express()

const requireAuthorization = jwt({
  secret: config.jwtSecret,
})

const upload = multer({
  dest: config.uploads,
  onFileUploadStart: function (file, req, res) {
    if (config.allowed_extensions.indexOf(file.extension) < 0) return false
  }
})

require('./passport')(passport, config)

server.set('port', process.env.PORT || 3030)
server.use(cookieParser('secret'))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json({limit: '25mb'}))
server.use(session({secret: 'secret', saveUninitialized: true, resave: true}))
server.use(passport.initialize())
server.use(passport.session())
server.enable('trust proxy')

/*
server.use(
  function (req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      jwt.verify(req.headers.authorization.split(' ')[1], config.jwtSecret, function (error, decoded) {
        if (error) console.log(error)
        console.log(decoded)
      })
    }
    console.log('here')
    return next()
  })
*/
// Catch unauthorized requests =================================================

server.use(
  function (error, req, res, next) {
    if (error.name === 'UnauthorizedError') {
      res.status(401)
      res.json({"message": error.name + ": " + error.message})
    }
  })


// Allow CORS ==================================================================

server.use(
  function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })


// Register, login and logout routes ===========================================

server.post('/login/',
  function (req, res, next) {
    passport.authenticate('login', function (error, token, user) {
      if (error) return res.status(500).json({"error": new Error(error)})
      return res.status(200).json({"user": user, "token": token})
    })(req, res, next)
  })

server.post('/register/',
  function (req, res, next) {
    passport.authenticate('register', function (error, token, user) {
      if (error) return res.status(500).json({"error": new Error(error)})
      return res.status(200).json({"user": user, "token": token})
    })(req, res, next)
  })

server.get('/logout/',
  requireAuthorization,
  function (req, res, next) {
    req.logout()
    res.status(200).end()
  })


// Message routes ==============================================================

server.get('/messages/:messages_id?/',
  requireAuthorization,
  function (req, res, next) {
    return next()
  }, routes.getMessage)

server.post('/messages/',
  requireAuthorization,
  function (req, res, next) {
    return next()
  }, routes.postMessage)


// Content routes ==============================================================

server.get('/:username/',
  function (req, res, next) {
    return next()
  }, routes.getUser)

server.post('/content/',
  requireAuthorization,
  upload.single('photo'),
  function (req, res, next) {
    return next()
  }, routes.postContent)

server.post('/content/:content_guid/comment/',
  function (req, res, next) {
    return next()
  }, routes.postComment)

server.get('/content/:content_guid/',
  function (req, res, next) {
    return next()
  }, routes.getContent)


module.exports = function (callback) {
  callback(server)
}
