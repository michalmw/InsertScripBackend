const R = require('ramda')
const bcrypt = require('bcryptjs')
const User = require('../users/model')


function createLogout() {
    console.log('a')
    return async ctx => {
        console.log('b')
        if (ctx.session && ctx.session.user)
            ctx.body = ctx.session.user
        else
            ctx.body = {
                login : null
            }
        ctx.session = null
    }
}

const router = require('koa-router')()

router
    .get('/', createLogout())


module.exports = router