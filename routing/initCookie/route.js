const router = require('koa-router')()
const ObjectId = require('mongoose').Types.ObjectId

router.get('/', ctx => {
    if (!ctx.session._id) {
        ctx.session._id = ObjectId()
        ctx.body = ctx.session._id
    }
})

module.exports = router
