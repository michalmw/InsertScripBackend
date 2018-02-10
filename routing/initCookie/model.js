const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Counter = new Schema({
    _id: String,
    counter: Number
})

const model = mongoose.model('Counter', Counter)

// module.exports = mongoose.model('Message', Counter)

new model({
    _id: 'counter',
    counter: 0
}).save(() => { })
 
module.exports = model