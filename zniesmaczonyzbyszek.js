require('./app')(process.env.MONGODB_URI || `mongodb://localhost/zniesmaczonyzbyszek`)
    .then(app => {
        app.listen(process.env.PORT || 8080)
    }).catch(console.log)