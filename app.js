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

async function errorCatchMiddleware(ctx, next) {
    try {
        await next();
    } catch (err) {
        console.log(err)
        if (err instanceof Error || err instanceof TypeError) {
            ctx.status = err.status || 400;
            ctx.body = err.message
        } else {
            ctx.status = 400
            ctx.body = err
        }
    }
}

app.use(require('koa-bodyparser')())
app.use(require('./corsMiddleware')(['http://localhost:4200', 'http://kordos.com']))
app.use(errorCatchMiddleware)
const session = require('koa-session')
app.keys = ['secret o']
app.use(session({
    encode: (x) => JSON.stringify(x),
    decode: (x) => JSON.parse(x)
}, app))

wss.on('connection', connectionHandler.handler)


router.use('/login', require('./routing/login/route').routes())


router.use('/api', require('./auth'))
router.use('/api/user', require('./routing/users/route').routes())
router.use('/api/company', require('./routing/company/route').routes())
router.use('/initCookie', require('./routing/initCookie/route').routes())
app.use(router.routes())
app.use(router.allowedMethods())
module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
        return connectToHttp
    })
}
