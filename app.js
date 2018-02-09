const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()
const WebSocket = require('ws')
const connectionHandler = require('./handleConnection')
const http = require('http')
const app = new Koa()
const connectToHttp = http.createServer(app.callback())
const wss = new WebSocket.Server({ server: connectToHttp })
mongoose.Promise = Promise

const session = require('koa-session')
app.keys = ['secret o']
app.use(session({
    encode: (x) => JSON.stringify(x),
    decode: (x) => JSON.parse(x)
}, app))

app.use(require('koa-bodyparser')())
app.use(require('./corsMiddleware')(['http://localhost:4200', 'http://kordos.com']))

wss.on('connection', connectionHandler)

router.use('/api', require('./routing/test/route').routes())
router.use('/initCookie', require('./routing/initCookie/route').routes())
app.use(router.routes())

module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
        return connectToHttp
    })
}
