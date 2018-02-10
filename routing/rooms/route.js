const router = require('koa-router')()
const Message = require('../messages/model')

module.exports.getRooms = getRooms
    function getRooms() {
        return async (ctx) => {
            ctx.body = await Message.aggregate([
                { $group: { _id: { sessionId: '$sessionId' } } }])
                .exec();
        }
    }

router.get('/', getRooms())

module.exports = router
