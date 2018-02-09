const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()
const WebSocket = require('ws')
const http = require('http')
const app = new Koa()
const connectToHttp = http.createServer(app.callback()).listen(8070)
const wss = new WebSocket.Server({ server: connectToHttp })
mongoose.Promise = Promise

app.use(require('koa-bodyparser')())
app.use(require('./corsMiddleware')(['http://localhost:4200','http://kordos.com/']))

wss.on('connection', (ws) => {
  ws.on('message', function incoming(message) {
      console.log('received: %s', message)
  })
  console.log('Client connected');

  ws.on('close', () => console.log('Client disconnected'));
});

router.use('/api', require('./routing/test/route').routes())
router.use('/initCookie', require('./routing/initCookie/route').routes())
app.use(router.routes())

module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
        return app
    })
}
