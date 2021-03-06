const url = require('url')
const cookieparser = require("cookie")

const Message = require('./routing/messages/model')
const Gateway = require('./routing/gateway/model')

const ObjectId = require('mongoose').Types.ObjectId
const users = new Map()

let companyUsers = []

function handler(ws, req) {
    console.log('head cookie', req.headers.cookie)
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

    if (session.user && (session.user.type === 'user' || session.user.type === 'owner' || session.user.type === 'admin')) {
        ws.gateway = session.user.gateway
        console.log(ws.gateway)
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

    if (companyUsers.find(x => x.gateway.indexOf(ws.gateId) !== -1)) {
        const obj = {
            type: 'online',
            online: true
        }
        ws.send(JSON.stringify(obj))
    } else {
        const obj = {
            type: 'online',
            online: false
        }
        ws.send(JSON.stringify(obj))
    }

    ws.on('message', async message => {
        let gatewayName = (await Gateway.findById(ws.gateId).lean().exec()) || {}
        console.log('test robert', gatewayName);
        const obj = {
            gateId: ws.gateId,
            sessionId: ws.sessionId,
            gateName: (gatewayName.name || 'brak nazwy'),
            message: message,
            name: ws.sessionId,
            type: 'fromClient',
            timestamp: new Date()
        }
        let toSend = obj
        if (!(await Message.findOne({ sessionId: ws.sessionId }))) {
            toSend = Object.assign(obj, { type: 'newRoom' })
        }

        new Message(obj).save()
        for (const userWs of filterGates([ws.gateId])) {
            userWs.send(JSON.stringify(toSend))
            console.log('sended to userId=', userWs.userId)
        }
    })

    ws.on('close', () => {
        users.delete(ws.sessionId)
    })
}


function handleCompanyUser(ws) {
    Message.aggregate()
        .match({
            gateId: { $in: ws.gateway.map(ObjectId) }
        })
        .group({
            _id: '$sessionId',
            gateId: { $first: '$gateId' },
            messages: { $push: '$$ROOT' }
        })
        .then(result => {
            for (const res of result) {
                res.name = res._id
            }
            ws.send(JSON.stringify({
                type: 'init',
                rooms: result
            }))
        })

    const clientToSend = getByValue(users, ws.gateway, 'gateId')

    const obj = {
        type: 'online',
        online: true
    }
    clientToSend.forEach(x => {
        console.log('login online')
        x.send(JSON.stringify(obj))
    })

    ws.on('message', async message => {
        console.log('message', message)
        const messageObj = JSON.parse(message)
        messageObj.type = 'fromUser'

        const gateId = (await Message.findOne({ sessionId: messageObj.sessionId })).gateId

        new Message(Object.assign(messageObj, { gateId })).save()

        for (const userWs of filterGates([messageObj.gateId])) {
            userWs.send(JSON.stringify(messageObj))
            console.log(`sended ${messageObj} to userId=`, userWs.userId)
        }

        const user = users.get(messageObj.sessionId)
        if (user) {
            user.send(JSON.stringify(messageObj))
            console.log(`sended ${messageObj.message} to userId=`, user.sessionId)
        }
    })

    ws.on('close', () => {
        companyUsers = companyUsers.filter(x => x !== ws)
        if (!companyUsers.find(x => x.gateway === ws.gateway)) {
            const obj = {
                type: 'online',
                online: false
            }
            const clientToSend = getByValue(users, ws.gateway, 'gateId')
            clientToSend.forEach(x => {
                console.log('on close')
                x.send(JSON.stringify(obj))
            })
        }
    })

}

function getByValue(map, searchValue, field) {

    let res = []
    for (let [key, value] of map.entries()) {
        if (value && value[field] && searchValue)
            if (searchValue.some(x => x == value[field]))
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

module.exports.sendMessage = (message) => {
    for (const userWs of filterGates([message.gateId])) {
        userWs.send(JSON.stringify(message))
        console.log('sended to userId=', userWs.userId)
    }
}
