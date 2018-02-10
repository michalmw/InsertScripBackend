// const chai = require('chai');
// const should = chai.should();
// const chaiHttp = require('chai-http');
// const server = ('../../zniesmaczonyzbyszek.js');
// const messageAdd = require('../gateway/route').addMess
// chai.use(chaiHttp);
//
// describe ('Messages', () => {
//   it('Should add message', (done) => {
//
//   });
// });

const mongoose = require('mongoose')
const Message = require('./model')
mongoose.connect('mongodb://localhost/zniesmaczonyzbyszek')
let db = mongoose.connection;
  return db.collection('Message').insert({name:'ewq', sessionId: 'qwe', message: '321321'})
