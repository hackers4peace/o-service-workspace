import Storage from 'o-storage-forkdb'
import Hapi from 'hapi'
import Handlers from 'o-api-hapi'

const config = require('./config.json')

const storage = new Storage(config.db)
const handlers = new Handlers (storage, config.hapi)
const server = new Hapi.Server()

server.register([
  {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      }]
    }
  }], function (err) {

  if(err) throw err

  // interface and port
  server.connection({
    port: config.hapi.port
  })

  // routes
  server.route([
    {
      method: 'GET',
      path: '/{all*}',
      config: { cors: true },
      handler: handlers.get.bind(handlers)
    }, {
      method: 'POST',
      path: '/{all*}',
      config: { cors: true },
      handler: handlers.add.bind(handlers)
    }
  ])

  // start!
  server.start(function() {
    server.log('info', 'Server running at:' + server.info.uri)
  })
})
