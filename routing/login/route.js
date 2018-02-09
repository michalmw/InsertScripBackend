const R = require('ramda')
const bcrypt = require('bcryptjs')
const User = require('../users/model') 

module.exports.createLogin = createLogin
function createLogin() {
    return async ctx => {
        let user = await User.findOne({ email: ctx.request.body.email }).lean()
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

router.post('/', createLogin())

module.exports = router