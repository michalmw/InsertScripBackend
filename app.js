const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('koa-router')()

mongoose.Promise = Promise

router.get('/hello', ctx => {
    ctx.body = {
        Hello: 'World'
    }
})

const app = new Koa()
app.use(require('koa-bodyparser')())

app.use(router.routes())

module.exports = (dbUrl) => {
    return mongoose.connect(process.env.MONGODB_URI || dbUrl).then(x => {
      return app
    })
  };