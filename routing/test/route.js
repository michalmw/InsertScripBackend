const router = require('koa-router')()

router.get('/', (ctx, next) => {
    ctx.body = {
        Hello: 'TEST'
    };
});

module.exports = router
