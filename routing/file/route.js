const Message = require('../messages/model')
const fs = require('fs')
const promisify = require('util').promisify

module.exports.createSaveOrder = createSaveOrder
function createSaveOrder(send) {
    return async (ctx) => {

        const writeFile = promisify(fs.writeFile)
        await writeFile(`${__dirname}/../../upload/${ctx.request.body.name}`, new Buffer(ctx.request.body.content, "base64"))

        let obj = {}
        obj.sessionId = ctx.session.id
        obj.type = ctx.request.body.type
        obj.name = ctx.request.body.name
        obj.message = ' '
        obj.gateId = ctx.request.body.gateId
        obj.url = 'https://zniesmaczonyzbyszek.herokuapp.com/' + ctx.request.body.name
        obj.timestamp = new Date()

        new Message(obj).save().catch(err => {
            console.log(err)
        })
        send(obj)

        ctx.body = {
            url: obj.url,
            type: 'image'
        }

    }
}


const router = require('koa-router')()


module.exports = (send) => {

    return router
        .post('/', createSaveOrder(send))

}
