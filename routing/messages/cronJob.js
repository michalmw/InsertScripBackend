const cron = require('node-cron')
const Message = require('./model')
const Room = require('../rooms/model')

cron.schedule('0 * * * *', function(){
  Messages.aggregate().group(
    {
      _id: '$sessionId',
      maxDate: {$max: '$timestamp'}
    },
  ).match({ maxDate: { $lt: Date.now() - maxDate}})
  .then(messages => {
    list.forEach(message => {

    })
  })
})
