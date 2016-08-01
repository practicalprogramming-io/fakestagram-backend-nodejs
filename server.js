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
  userProperty: 'payload'
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


// Catch unauthorized requests =================================================
server.use(
  function (error, req, res, next) {
    if (error.name === 'UnauthorizedError') {
      res.status(401)
      res.json({"message": error.name + ": " + error.message})
    }
  })

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


// Front end routes ============================================================



module.exports = function (callback) {
  callback(server)
}
