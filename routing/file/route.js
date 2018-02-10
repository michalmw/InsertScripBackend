const Message = require('../messages/model')
const fs = require('fs')
const promisify = require('util').promisify

module.exports.createSaveOrder = createSaveOrder
function createSaveOrder() {
    return async (ctx) => {

        let message = await Message.findOne({ sessionId: ctx.session.id }).lean().exec()
        if (!message) throw 'Canot add file before first message'
        const writeFile = promisify(fs.writeFile)
        await writeFile(`${__dirname}/../../upload/${ctx.request.body.name}`, new Buffer(ctx.request.body.content, "base64"))
        

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
