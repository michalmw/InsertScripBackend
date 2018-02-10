const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Counter = new Schema({
    counter: Number
})

const model = mongoose.model('Message', Counter)

// module.exports = mongoose.model('Message', Counter)

model.collection.insertOne({
    _id: 'counter',
    counter: 0
}, (err, res) => { })

module.exports = model