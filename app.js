const Koa = require('koa')

const router = require('koa-router')()

router.get('/hello', ctx => {
    ctx.body = {
        Hello: 'World'
    }
})

const app = new Koa()
app.use(require('koa-bodyparser')())

app.use(router.routes())

app.listen(8080)