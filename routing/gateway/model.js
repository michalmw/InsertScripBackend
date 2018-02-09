const mongoose = require('mongoose')
const isemail = require('isemail')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Gateway = new Schema({
    name : { required : true , type : String},
    companyId : { type: Schema.Types.ObjectId, ref: 'Company'}
},
    { strict: false })

module.exports = mongoose.model('Gateway', Gateway)
