const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Message = new Schema({
    gateId: { type: Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now },
    sessionId: { type: String, required: true },
    message: { required: true, type: String },
    type: String,
    name : String,
    url : String
},
    { strict: false })

module.exports = mongoose.model('Message', Message)
