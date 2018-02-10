const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Room = new Schema({
},
    { strict: false })

module.exports = mongoose.model('Room', Room)
