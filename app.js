const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()
const WebSocket = require('ws')
const http = require('http')
const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });
mongoose.Promise = Promise

app.use(require('koa-bodyparser')())

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
