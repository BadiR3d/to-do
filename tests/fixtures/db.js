const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'mike',
  surname: 'mikaena',
  email: 'mike@doe.com',
  password: 'mike@pass2',
  birthday: '08 July 2003',
  title: 'Mr',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.SECRET)
  }]
}

const populateDB = async () => {
  await User.deleteMany()
  await new User(userOne).save()
}

module.exports = {
  userOneId,
  userOne,
  populateDB
}