var exec = require('child_process').exec
  , supertest = require('supertest')
;

describe('Fakestagram Tests', function () {

  var server, agent;

  before(function (done) {
    var cmd = 'createdb -O fakestagram_user fakestagram_db -E utf8';
    cmd += ' && psql -d fakestagram_db -f database.sql';
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error;
      if (stderr) throw stderr;
      require('./server')(function (server) {
        server = server;
        agent = supertest.agent(server);
        done();
      });
    });
  });

  after(function () {
    var cmd = 'dropdb fakestagram_db';
    exec(cmd, function (error, stdout, stderr) {
      if (error) throw error;
      if (stderr) throw stderr;
    });
  });

  describe('USER Tests', function () {

    it('POST register a new user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/register/').send(request).expect(201, done);
    });

    it('POST login to existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/login/').send(request).expect(200, done);
    });

    it('GET logout out logged in user account', function (done) {
      agent.get('/logout/').expect(200, done);
    });

  });

});
