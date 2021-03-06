const mongoose = require('mongoose')
const isemail = require('isemail')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const User = new Schema({
    password: { required: true, type: String },
    email: {
        required: true, type: String
    },
    type: { required: true, type: String, enum: ['user', 'owner', 'admin'] },
    companyId : { type: Schema.Types.ObjectId, ref: 'Company'},
    gateway : [ { type: Schema.Types.ObjectId, ref: 'Gateway'}]
},
    { strict: false })

module.exports = mongoose.model('User', User)