var supertest = require('supertest')


describe('Create Test Data', function () {

  var server, agent

  before(function (done) {
    require('./server')(function (server) {
      server = server
      agent = supertest.agent(server)
      done()
    })
  })

  describe('Create Data', function () {

    var payload;

    it('POST login to existing user account', function (done) {
      var request = {
        "username": "asonnenschein",
        "email": "adrian.sonnenschein@gmail.com",
        "password": "password"
      }
      agent.post('/login/').send(request).end(function (error, response) {
        if (error) throw error
        if (response.status === 200) {
          payload = response.body.token
          done()
        }
      })
    })

    it('POST content to account', function (done) {
      agent.post('/content/')
        .set({'Authorization': 'Bearer ' + payload})
        .attach('photo', './huckleberryfinn.jpg')
        .end(function (error, response) {
          if (error) throw error
          if (response.status === 200) {
            done()
          }
        })
    })

    it('GET logout out logged in user account', function (done) {
      agent.get('/logout/')
        .set({'Authorization': 'Bearer ' + payload})
        .expect(200, done)
    })

  })

})
