'use strict'


var express = require('express')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , multer = require('multer')
  , config = require('./config.json')
  , database = require('./database')
  , routes = require('./routes')(database)
  , server = express()
  , upload = multer({
      dest: config.uploads,
      onFileUploadStart: function (file, req, res) {
        if (config.allowed_extensions.indexOf(file.extension) < 0) return false
      }
    })


require('./passport')(passport)

server.set('port', process.env.PORT || 3030)
server.use(cookieParser('secret'))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json({limit: '25mb'}))
server.use(session({secret: 'secret', saveUninitialized: true, resave: true}))
server.use(passport.initialize())
server.use(passport.session())
server.enable('trust proxy')


function requireAuthorization (req, res, next) {
  if (req.isAuthenticated && req.user.id) return next()
  else res.status(401).send("Unauthorized request!")
}


// Register, login and logout routes ===========================================

server.post('/login/',
  passport.authenticate('login'),
  function (req, res, next) {
    res.status(200).end()
//    var username = req.user.get('username')
//    res.redirect('/' + username + '/')
  })

server.post('/register/',
  passport.authenticate('register'),
  function (req, res, next) {
    res.status(201).end()
//    var username = req.user.get('username')
//    res.redirect('/' + username + '/')
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
