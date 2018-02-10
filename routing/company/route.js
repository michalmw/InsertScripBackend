const Company = require('./model')

module.exports.createSaveOrder = createSaveOrder
function createSaveOrder() {
    return async (ctx) => {
        ctx.body = await new Company(ctx.request.body).save()
    }
}

module.exports.createUpateOrder = createUpateOrder
function createUpateOrder() {
    return async (ctx) => {
        ctx.body = await Company.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
    }
}

module.exports.createDeleteOrder = createDeleteOrder
function createDeleteOrder() {
    return async (ctx) => {
        ctx.body = await Company.findByIdAndRemove(ctx.params.id)
    }
}

module.exports.createGetOrders = createGetOrders
function createGetOrders() {
    return async (ctx) => {
        if(ctx.session.user && ctx.session.user.type && ctx.session.user.type !== 'admin'){
          let tab = []
            ctx.body = await Company.findById(ctx.session.user.companyId).lean().exec().then(result => {
              tab.push(result)
              return tab
            })
        }
        else {
            ctx.body = await Company.find().lean().exec()
        }
    }
}

module.exports.createGetByIdOrder = createGetByIdOrder
function createGetByIdOrder() {
    return async (ctx) => {
        ctx.body = await Company.findById(ctx.params.id)
        if (!ctx.body) throw new Error('tag not found')
    }
}

const router = require('koa-router')()

router
    .get('/', createGetOrders())
    .get('/:id', createGetByIdOrder())
    .post('/', createSaveOrder())
    .put('/:id', createUpateOrder())
    .delete('/:id', createDeleteOrder())
module.exports = router
