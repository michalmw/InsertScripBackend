const cron = require('node-cron')
const Message = require('./model')
const Room = require('../rooms/model')

cron.schedule('* * * *', function(){
    Message.find().sort('-timestamp').exec().then(messages => {
      messages.forEach(message => {
        if (Date.now() - message.timestamp > 900000) {
          return Room.findByIdAndUpdate(message.sessionId, {active: false}).exec()
        }
      })
  });
})
