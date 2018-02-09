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
        ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
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
        ctx.body = await User.find()
    }
}

module.exports.createGetByIdUser = createGetByIdUser
function createGetByIdUser() {
    return async (ctx) => {
        ctx.body = await User.findById(ctx.params.id)
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

