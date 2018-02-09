const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Message = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company'},
    timestamp: {type: Date, default: Date.now},
    sessionId: {type: String, required: true},
    message: { required: true, type: String }
},
    { strict: false })

module.exports = mongoose.model('Message', Message)
