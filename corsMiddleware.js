module.exports = (avalibleOrigins) => {
    const avalibleSet = new Set(avalibleOrigins)
    return async (ctx, next) => {

        if (avalibleSet.has(ctx.get('origin'))) {
            ctx.set('Access-Control-Allow-Origin',ctx.get('origin'))
            ctx.set('Access-Control-Allow-Methods','GET, PUT, PATCH, POST, DELETE, HEAD, OPTIONS')
            ctx.set('Access-Control-Allow-Credentials',true)
            ctx.set('Access-Control-Allow-Headers', "Content-Type, Authorization")
        }
        await next()
    }
}
