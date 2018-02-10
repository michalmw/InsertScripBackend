module.exports = async (ctx, next) => {
    const user = ctx.session.user
    if (!user || typeof user !== 'object') {
      throw 'Session is not present'
      await ctx.redirect(`${ctx.request.origin}/login`)
    }
    await next()
}
