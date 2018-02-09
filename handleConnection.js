

function connect(ws, req) {
    ws.send('Hi there, I am a WebSocket server');

    console.log(req.headers.cookie);
    console.log('Client connected');

    ws.on('open', req => {
      console.log('open')
    })

    ws.on('request', req => {
    })

    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        ws.send(message)
    })

    ws.on('close', () => console.log('Client disconnected'));
}

module.exports = connect
