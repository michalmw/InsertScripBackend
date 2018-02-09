
const url = require('url')
const cookieparser = require("cookie")

const Message = require('./routing/messages/model')

const users = new Map

const companyUsers = []

function handler(ws, req) {
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
        companyUsers.push(ws.getes = session.user.gates)
        handleCompanyUser(ws, session.user.companyId)
        console.log('company User joined companyId=', companyId)
    } else {
        const gateId = url.parse(req.url, true).query.gateId
        users.set(session.id, ws)
        ws.sessionId = session.id
        ws.gateId = gateId
        handleUser(ws, gateId)
        console.log('user joined companyId=', companyId)
        console.log('sessionId=', session.id)
    }
}

function handleUser(ws) {
    ws.on('message', message => {
        const obj = {
            companyId,
            sessionId,
            message
        }
        new Message(obj).save()
        for (const userWs of filterGates([ws.gateId]))
            userWs.send(JSON.stringify(obj))
    })

    ws.on('close', () => {
        users.delete(ws.sessionId)
    })
}


function handleCompanyUser(ws) {

    ws.on('message', async message => {

        const messageObj = JSON.parse(message)

        new Message(messageObj).save()

        const gate = (await Message.findOne({ sesionId: message.sesionId })).gateId

        for (const userWs of filterGates([gate])) {
            userWs.send(JSON.stringify(messageObj))
        }

        const user = users.get(messageObj.sesionId)
        if (user) {
            user.send(messageObj.message)
        }
    })

    ws.on('close', () => {
        companyUsers = companyUsers.filter(x => x !== ws)
    })

}

function intersects(arr1, arr2) {
    return arr1.some(x => arr2.includes(x))
}

function filterGates(gate) {
    return companyUsers.filter(ws => intersects(ws.gates, gates))
}

function messageToGates(message, gates) {
    const sendTo = companyUsers.filter(ws => intersects(ws.gates, gates))
    for (const s of sendTo) {
        s.send(message)
    }
}



module.exports.handler = handler


module.exports.logedInUsers = () => new Set(users.keys)