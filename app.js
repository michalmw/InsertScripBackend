const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()
const WebSocket = require('ws')
const app = new Koa();
const wss = new WebSocket.Server({port: 8060});
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
app.use(require('./corsMiddleware')(['http://localhost:4200','http://kordos.com/']))
app.use(errorCatchMiddleware)

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })

    ws.send('something')
})

router.use('/api', require('./routing/test/route').routes())
router.use('/api/company', require('./routing/company/route').routes())
router.use('/api/user', require('./routing/users/route').routes())
router.use('/initCookie', require('./routing/initCookie/route').routes())
app.use(router.routes())

module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
        return app
    })
}
