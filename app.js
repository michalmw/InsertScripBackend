const Koa = require('koa');
const router = require('koa-router')();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8070 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

router.get('/hello', ctx => {
    ctx.body = {
        Hello: 'World'
    };
});

const app = new Koa();
app.use(require('koa-bodyparser')());

app.use(router.routes());

app.listen(8080);
