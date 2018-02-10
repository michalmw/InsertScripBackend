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

        const action = {
            'user' : () => [],
            'owner' : () => Company.findById(ctx.session.user.companyId).lean().exec().then(result => [result]),
            'admin' : () => Company.find().lean().exec()
        }

        ctx.body = action[ctx.session.user.type]()
    }
}

module.exports.createGetByIdCompany = createGetByIdCompany
function createGetByIdCompany() {
    return async (ctx) => {
        ctx.body = await Company.findById(ctx.params.id)
        if (!ctx.body) throw new Error('tag not found')
    }
}

const router = require('koa-router')()

router
    .get('/', createGetOrders())
    .get('/:id', createGetByIdCompany())
    .post('/', createSaveOrder())
    .put('/:id', createUpateOrder())
    .delete('/:id', createDeleteOrder())
module.exports = router
