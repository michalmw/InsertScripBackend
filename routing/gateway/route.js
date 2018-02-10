const Gateway = require('./model')
const Messages = require('../messages/model')

const router = require('koa-router')()

const R = require('ramda')

module.exports.getGateway = getGateway
function getGateway() {
  return async (ctx) => {
    ctx.body = await Gateway.find().lean().exec()
  }
}

module.exports.getOneGateway = getOneGateway
function getOneGateway() {
  return async (ctx) => {
    ctx.body = await Gateway.findById(ctx.params.id).lean().exec()
  }
}

module.exports.addGateway = addGateway
function addGateway() {
  return async (ctx) => {
    ctx.body = await new Gateway(ctx.request.body).save()
  }
}

module.exports.addMess = addMess
function addMess() {
  return async (ctx) => {
    ctx.body = await new Messages(ctx.request.body).save()
  }
}

module.exports.putGateway = putGateway
function putGateway() {
  return async (ctx) => {
    ctx.body = await Gateway.findByIdAndUpdate(ctx.params.id, R.dissoc('_id', ctx.request.body), { new: true }).lean().exec()
  }
}

module.exports.deleteGateway = deleteGateway
function deleteGateway() {
  return async (ctx) => {
    ctx.body = await Gateway.findByIdAndRemove(ctx.params.id).lean().exec()
  }
}
router
  .get('/', getGateway())
  .get('/:id', getOneGateway())
  .post('/', addGateway())
  .post('/addM', addMess())
  .put('/:id', putGateway())
  .delete('/:id', deleteGateway())

module.exports = router
