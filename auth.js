module.exports = async (ctx, next) => {
    const user = ctx.session.user
    console.log(user)
    if (typeof user !== 'object' || !user) throw 'Session is not present'
    await next()
}