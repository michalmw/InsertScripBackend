const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Message = new Schema({
    company: { type: Schema.Types.ObjectId, ref: 'Company'},
    createDate: {type: Date, default: Date.now},
    sessionId: {type: String, required: true},
    text: { required: true, type: String }
},
    { strict: false })

module.exports = mongoose.model('Message', Message)
