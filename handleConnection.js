
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

function handleUser(ws, companyId, sesionId) {

    ws.on('message', message => {
        const company = companies.get(companyId)
        for (const companyUser of company) {
            companyUser.send({

            })
        }
    })

    ws.on('close', () => {
        users.delete(sesionId)
    })
}


function handleCompanyUser(ws, companyId) {

    ws.on('message', message => {
        const company = companies.get(companyId)
        for (const companyUser of company) {
            if (companyUser !== ws) {
                companyUser.send(message)
            }
        }
        const user = users.get(message.sesionId)
        if (user) {
            user.send(message.message)
        }
    })

    ws.on('close', () => {
        const companyUsers = companies.get(companyId)
        companies.set(companyId, companyUsers.filter(x => x !== ws))
    })

}

module.exports = connect
