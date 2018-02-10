const Message = require('../messages/model')

module.exports.createSaveOrder = createSaveOrder
function createSaveOrder() {
    return async (ctx) => {

        let message = await Message.findOne({ sessionId: obj.sessionId }).lean().exec()
        await fs.writeFile(`../../upload/${ctx.body.name}.img`, new Buffer(request.body.content, "base64"))
        
        if (!message) throw 'Canot add file before first message'

        let obj = {}
        obj.sessionId = ctx.session.id
        obj.type = request.body.type
        obj.name = request.body.name
        obj.gateId = message.gateId
        obj.url = 'https://zniesmaczonyzbyszek.herokuapp.com/' + request.body.name

        new Message.save(obj)

        ctx.body = obj.url

    }
}


const router = require('koa-router')()

router
    .post('/', createSaveOrder())

module.exports = router
