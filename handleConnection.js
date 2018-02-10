const url = require('url')
const cookieparser = require("cookie")

const Message = require('./routing/messages/model')

const users = new Map()

let companyUsers = []

function handler(ws, req) {
    if (!req.headers.cookie) {
        ws.close()
        return
    }
    const cookie = cookieparser.parse(req.headers.cookie)
    console.log('cookie', cookie)
    if (!cookie) {
        ws.close()
        return
    }
    const session = JSON.parse(cookie['koa:sess'])
    if (session.user && (session.user.type === 'user' || session.user.type === 'owner')) {
        ws.gateway = session.user.gateway
        ws.userId = session.user._id
        companyUsers.push(ws)
        handleCompanyUser(ws)
        console.log('company user connected')
    } else {
        const gateId = url.parse(req.url, true).query.gateId
        users.set(session.id, ws)
        ws.sessionId = session.id
        ws.gateId = gateId
        handleUser(ws, gateId)
        console.log('sessionId=', session.id)
    }
}



function handleUser(ws) {

    Message.find({ sessionId: ws.sessionId })
        .lean().then(res => {
            ws.send(JSON.stringify({
                type: 'init',
                messages: res
            }))
        })

    ws.on('message', message => {
        const obj = {
            gateId: ws.gateId,
            sessionId: ws.sessionId,
            message: message,
            type: 'fromClient',
            timestamp: new Date()
        }

        new Message(obj).save()
        for (const userWs of filterGates([ws.gateId])) {
            userWs.send(JSON.stringify(obj))
            console.log('sended to userId=', userWs.userId)
        }
    })

    ws.on('close', () => {
        users.delete(ws.sessionId)
    })
}


function handleCompanyUser(ws) {
    console.log(ws.gateway)
    Message.aggregate()
        // .match({
        //     gateId: { $in: ws.gateway }
        // })
        .group({
            _id: '$sessionId',
            gateId: { $first: '$gateId' },
            messages: { $push: '$$ROOT' }
        })
        // .group({
        //     _id: '$gateId',
        //     rooms: { $push: '$$ROOT' }
        // })
        .then(result => {
          for(let i = 0; i < result.length; i++) {
            result[i].name = 'ładna nazwa'
          }
            ws.send(JSON.stringify({
                type: 'init',
                rooms: result
            }))
        })

    const clientToSend = getByValue(users, ws.gateway, gateway)

    const obj = {
        type: 'online',
        online: true
    }
    clientToSend.forEach(x => {
        x.send(JSON.stringify(obj))
    })

    ws.on('message', async message => {

        const messageObj = JSON.parse(message)
        messageObj.type = 'fromUser'

        new Message(messageObj).save()

        // const gate = (await Message.findOne({ sesionId: message.sesionId })).gateId

        for (const userWs of filterGates([messageObj.gateId])) {
            userWs.send(JSON.stringify(messageObj))
            console.log(`sended ${messageObj} to userId=`, userWs.userId)
        }

        const user = users.get(messageObj.sessionId)
        if (user) {
            user.send(messageObj.message)
            console.log(`sended ${messageObj.message} to userId=`, user.sessionId)
        }
    })

    ws.on('close', () => {
        companyUsers = companyUsers.filter(x => x !== ws)
        if(!companyUsers.find(x => x.gateway === ws.gateway))
        {
            const obj = {
                type: 'online',
                online: false
            }
            const clientToSend = getByValue(users, ws.gateway, gateway)
            clientToSend.forEach(x => x.send(JSON.stringify(obj)))
        }
    })

}

function getByValue(map, searchValue, field) {

    let res = []
    for (let [key, value] of map.entries()) {
        if (value[field] === searchValue)
            res.push(value)
    }
    return res

}

function intersects(arr1, arr2) {
    return arr1.some(x => arr2.includes(x))
}

function filterGates(gates) {
    return companyUsers.filter(ws => intersects(ws.gateway, gates))
}

module.exports.handler = handler

module.exports.logedInUsers = () => new Set(users.keys)
