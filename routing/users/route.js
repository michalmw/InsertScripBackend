const User = require('./model')
const bcrypt = require('bcryptjs')
const R = require('ramda')

module.exports.hashPassword = hashPassword
function hashPassword(password) {
    return bcrypt.genSalt().then(salt => bcrypt.hash(password, salt))
}

module.exports.createRegister = createRegister
function createRegister() {
    return async (ctx) => {
        if (typeof ctx.request.body.password !== 'string' || !ctx.request.body.password) throw "invalid password"
        const hash = await hashPassword(ctx.request.body.password)
        ctx.body = R.omit(['password'], await new User(R.assoc('password', hash, ctx.request.body)).save())
    }
}

module.exports.createUpateUser = createUpateUser
function createUpateUser() {
    return async (ctx) => {
        ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true }).populate('companyId')
    }
}

module.exports.createDeleteUser = createDeleteUser
function createDeleteUser() {
    return async (ctx) => {
        ctx.body = await User.findByIdAndRemove(ctx.params.id)

    }
}

module.exports.createGetUsers = createGetUsers
function createGetUsers() {
    return async (ctx) => {
        console.log(ctx)
        if (ctx.session.user.type === 'user') {
            ctx.body = await User.find({ _id: ctx.session.user._id }).populate('companyId')
        } else if (ctx.session.user.type === 'owner') {
            ctx.body = await User.find({ companyId: ctx.session.user.companyid }).populate('companyId')
        } else if (ctx.session.user.type === 'admin') {
            ctx.body = await User.find().populate('companyId')
        }
    }
}

module.exports.createGetByIdUser = createGetByIdUser
function createGetByIdUser() {
    return async (ctx) => {
        ctx.body = await User.findById(ctx.params.id).populate('companyId')
        if (!ctx.body) throw new Error('tag not found')
    }
}



const router = require('koa-router')()

router
    .get('/', createGetUsers())
    .get('/:id', createGetByIdUser())
    .post('/', createRegister())
    .put('/:id', createUpateUser())
    .delete('/:id', createDeleteUser())
module.exports = router

