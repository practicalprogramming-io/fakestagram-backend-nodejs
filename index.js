'use strict'


require('./server')(function (server) {
  server.listen(server.get('port'), function () {
    var host = this.address().address
      , port = this.address().port
    console.log('Server listening on ' + host + ':' + port)
  })
})
