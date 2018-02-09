function connect(ws, req) {
    console.log(req.headers.cookie);
    console.log('Client connected');

    ws.on('request', req => {

    })

    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        ws.send('test')
    })

    ws.on('close', () => console.log('Client disconnected'));
}

module.exports = connect
