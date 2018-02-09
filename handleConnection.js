function connect(ws, req) {
    console.log('test on open');

    ws.on('connection', function connected(message) {
        console.log(req.headers.cookie);
        console.log('Client connected');
    })

    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        ws.send('something');
    })

    ws.on('close', () => console.log('Client disconnected'));
}

module.exports = connect
