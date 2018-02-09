const R = require('ramda')
const bcrypt = require('bcryptjs')
const User = require('../users/model') 
module.exports.createRegister = createRegister
function createRegister() {
    return async (ctx) => {
        if (typeof ctx.request.body.password !== 'string' || !ctx.request.body.password) throw "invalid password"
        const hash = await hashPassword(ctx.request.body.password)
        ctx.body = R.omit(['password'], await new User(R.assoc('password', hash, ctx.request.body)).save())
     }
}

module.exports.createLogin = createLogin
function createLogin() {
    console.log('bbbbbbbbbbbbbbbbb')
    return async ctx => {
        console.log('aaaaaaaaaaaaaaaa')
        const user = await User.findOne({ email: ctx.request.body.email })
        if (!user) throw 'invalid credentials'
        if (!(await bcrypt.compare(ctx.request.body.password, user.password))) {
            throw 'invalid credentials'
        }
        ctx.body = 'asd'
        ctx.body = {
            user: R.omit(['password'], user)
        }
    }
}

const router = require('koa-router')()

router.post('/', createRegister())

module.exports = router