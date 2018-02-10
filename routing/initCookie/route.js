const router = require('koa-router')()
const ObjectId = require('mongoose').Types.ObjectId

const Counter = require('./model')

router.get('/', async ctx => {
    if (!ctx.session.id) {
        ctx.session.id = (await Counter.findByIdAndUpdate('counter', { $inc: { counter: 1, } }).exec()).counter
    }
    console.log(ctx.session.id)
    ctx.body = ctx.session.id
})

module.exports = router
