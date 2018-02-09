const url = require('url')
const cookieparser = require("cookie")

const Message = require('./routing/messages/model')

const users = new Map
const companies = new Map

function connect(ws, req) {
    const cookie = cookieparser.parse(req.headers.cookie)
    if (!cookie) {
        ws.close()
        return
    }
    const session = JSON.parse(cookie['koa:sess'])

    if (session.user && (session.user.type === 'user' || session.user.type === 'owner')) {
        const company = companies.get(session.user.companyId)
        if (!company) {
            companies.set(session.user.companyId, [ws])
        }
        company.push(ws)
        handleCompanyUser(ws, session.user.companyId)
    } else {
        const companyId = url.parse(req.url, true).query.companyId
        users.set(session.id, ws)
        handleUser(ws, companyId, session.id)
    }
}

function handleUser(ws, companyId, sesionId) {

    ws.on('message', message => {
        const obj = {
            companyId,
            sessionId,
            message
        }
        const messageStr = JSON.stringify(obj)
        new Message(obj).save()
        for (const companyUser of companies.get(companyId) || []) {
            companyUser.send(messageStr)
        }
    })

    ws.on('close', () => {
        users.delete(sesionId)
    })
}


function handleCompanyUser(ws, companyId) {

    ws.on('message', message => {

        const messageObj = Object.assign(JSON.parse(message), { companyId })
        Object.assign({}, { a: 'asd' })

        new Message(messageObj).save()

        const company = companies.get(companyId) || []
        for (const companyUser of company) {
            if (companyUser !== ws) {
                companyUser.send(JSON.stringify(messageObj))
            }
        }
        const user = users.get(messageObj.sesionId)
        if (user) {
            user.send(messageObj.message)
        }
    })

    ws.on('close', () => {
        const companyUsers = companies.get(companyId)
        companies.set(companyId, companyUsers.filter(x => x !== ws))
    })

}

module.exports = connect
