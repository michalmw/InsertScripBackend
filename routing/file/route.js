const Message = require('../messages/model')
const fs = require('fs')

module.exports.createSaveOrder = createSaveOrder
function createSaveOrder() {
    return async (ctx) => {

        let message = await Message.findOne({ sessionId: ctx.session.id }).lean().exec()
        await fs.writeFile(`../../upload/${ctx.request.body.name}.img`, new Buffer(ctx.request.body.content, "base64"))
        
        if (!message) throw 'Canot add file before first message'

        let obj = {}
        obj.sessionId = ctx.session.id
        obj.type = ctx.request.body.type
        obj.name = ctx.request.body.name
        obj.gateId = message.gateId
        obj.url = 'https://zniesmaczonyzbyszek.herokuapp.com/' + ctx.request.body.name

        new Message.save(obj)

        ctx.body = {
            url : obj.url,
            type : 'image'
        }

    }
}


const router = require('koa-router')()

router
    .post('/', createSaveOrder())

module.exports = router
