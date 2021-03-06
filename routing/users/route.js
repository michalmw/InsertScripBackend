const User = require('./model')
const bcrypt = require('bcryptjs')
const R = require('ramda')
const server = require('../email')
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
        if (ctx.request.body.password && typeof ctx.request.body.password === 'string') {
            ctx.request.body.password = await hashPassword(ctx.request.body.password)
        } else {
            delete ctx.request.body.password
        }

        ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true }).populate('companyId')
    }
}

module.exports.sendEmail = sendEmail
function sendEmail() {
  return async (ctx) => {
    ctx.body = await server.sendmail('ziomal09bb@gmail.com', 'Nowe pytanie', ctx.request.body.email, `${ctx.request.body.name} pisze: ${ctx.request.body.text}`)
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

        const actions = {
            'user': () => User.find({ _id: ctx.session.user._id }).populate('companyId'),
            'owner': () => User.find({ companyId: ctx.session.user.companyId }).populate('companyId'),
            'admin': () => User.find().populate('companyId')
        }
        ctx.body = await actions[ctx.session.user.type]()
        console.log(ctx)
    }
}

module.exports.createGetByIdUser = createGetByIdUser
function createGetByIdUser() {
    return async (ctx) => {
        ctx.body = await User.findById(ctx.params.id).populate('companyId')
        if (!ctx.body) throw new Error('tag not found')
    }
}

module.exports.sendPhoto = sendPhoto
function sendPhoto() {
    return async (ctx) => {
        
    }
}

const router = require('koa-router')()

router
    .get('/', createGetUsers())
    .get('/:id', createGetByIdUser())
    .post('/email', sendEmail())
    .post('/photo', sendPhoto())
    .post('/', createRegister())
    .put('/:id', createUpateUser())
    .delete('/:id', createDeleteUser())
module.exports = router
