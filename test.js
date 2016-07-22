var exec = require('child_process').exec
  , supertest = require('supertest')


describe('Fakestagram Tests', function () {

  var server, agent

  before(function (done) {
    var cmd = 'createdb -O fakestagram_user fakestagram_db -E utf8'
    cmd += ' && psql -d fakestagram_db -f database.sql'
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error
      if (stderr) throw stderr
      require('./server')(function (server) {
        server = server
        agent = supertest.agent(server)
        done()
      })
    })
  })

  after(function () {
    var cmd = 'dropdb fakestagram_db'
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error
      if (stderr) throw stderr
    })
  })

  describe('API Tests', function () {

    var user
      , filename

    it('POST register a new user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      }
      agent.post('/register/').send(request).expect(201, done)
    })

    it('POST login to existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      }
      agent.post('/login/').send(request).expect(200, done)
    })

    it('GET existing user account', function (done) {
      agent.get('/testuser/').expect(200, done)
    })

    it('POST content to account', function (done) {
      agent.post('/content/')
        .attach('photo', './cutedog.jpg')
        .end(function (error, response) {
          if (error) throw error
          if (response.status === 200) {
            user = response.body.users_id
            filename = response.body.name
            done()
          }
        })
    })

    it('POST comment to content', function (done) {
      var request = {"comment": "this is a test comment!"}
        , path = '/content/' + filename + '/comment/?takenby=testuser'
      agent.post(path).send(request).expect(200, done)
    })

    it('POST comment to content', function (done) {
      var request = {"comment": "this is a test comment!"}
        , path = '/content/' + filename + '/comment/?takenby=testuser'
      agent.post(path).send(request).expect(200, done)
    })


    it('GET content', function (done) {
      var path = '/content/' + filename + '/?takenby=testuser'
      agent.get(path).expect(200, done)
    })

    it('GET logout out logged in user account', function (done) {
      agent.get('/logout/').expect(200, done)
    })

  })

})
