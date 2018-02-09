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
        ctx.body = await User.find().populate('companyId')
        console.log(ctx.body)

    }
}

module.exports.createGetByIdUser = createGetByIdUser
function createGetByIdUser() {
    return async (ctx) => {
        ctx.body = await User.findById(ctx.params.id).populate('companyId')
        if (!ctx.body) throw new Error('tag not found')
    }
}

module.exports.createLogin = createLogin
function createLogin() {
    return async ctx => {
        const user = await User.findOne({ email: ctx.request.body.email })
        if (!user) throw 'invalid credentials'
        if (!(await bcrypt.compare(ctx.request.body.password, user.password))) {
            throw 'invalid credentials'
        }
        user = R.omit(['password'], user)
        ctx.session.user = user
        ctx.body = {
            user: user
        }
    }
}

const router = require('koa-router')()

router
    .get('/', createGetUsers())
    .get('/:id', createGetByIdUser())
    .post('/login', createLogin())
    .post('/', createRegister())
    .put('/:id', createUpateUser())
    .delete('/:id', createDeleteUser())
module.exports = router

