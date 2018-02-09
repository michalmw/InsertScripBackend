const router = require('koa-router')()

router.get('/', (ctx, next) => {
    ctx.session.v = ctx.session.v || 0
    ctx.body = {
        Hello: 'session' + ctx.session.v++
    }
})

module.exports = router
