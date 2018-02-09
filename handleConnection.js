function connect(ws, req) {
    console.log(req);

    console.log('Client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        ws.send('something');
    })

    ws.on('close', () => console.log('Client disconnected'));
}

modules.exports = connect
