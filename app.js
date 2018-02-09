const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()
const WebSocket = require('ws')
const app = new Koa();
const wss = new WebSocket.Server({port: 8060});
mongoose.Promise = Promise

app.use(require('koa-bodyparser')())
app.use(require('./corsMiddleware')(['http://localhost:4200']))

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })

    ws.send('something')
})

router.use('/api', require('./routing/test/route').routes())

app.use(router.routes())

module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
      return app
    })
  }
