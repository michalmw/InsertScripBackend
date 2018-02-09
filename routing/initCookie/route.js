const router = require('koa-router')()
const ObjectId = require('mongoose').Types.ObjectId

router.get('/', ctx => {
    if (!ctx.session.id) {
        ctx.session.id = ObjectId().toString()
    }
    ctx.body = ctx.session.id
})

module.exports = router
