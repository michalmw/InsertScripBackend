
const url = require('url')
const cookieparser = require("cookie")

const users = new Map
const companies = new Map

function connect(ws, req) {
    const cookie = cookieparser.parse(req.headers.cookie)
    const session = JSON.parse(cookie['koa:sess'])

    if (session.user && (session.user.type === 'user' || session.user.type === 'owner')) {
        const company = companies.get(session.user.companyId)
        if (!company) {
            companies.set([ws])
        }
        company.push(ws)
    } else {
        const companyId = url.parse(req.url, true).query.companyId
        users.set(session.id, ws)
    }

    ws.on('message', message => {
        console.log('received: %s', message)
        ws.send('something')
    })

    ws.on('close', () => console.log('Client disconnected'));
}

function handleUser(ws, companyid, sesionId) {

    ws.on('message', message => {
        const company = companies.get(companyid)
        for (const companyUser of company) {
            companyUser.send(message)
        }
    })

    ws.on('dis')


}


module.exports = connect