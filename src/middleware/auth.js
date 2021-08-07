const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async function (req, res, next) {
  try {
    console.log('in auth middleware')
    
    const token = req.header("authorization").replace('Bearer ', '')
    const decoded = jwt.verify(token, 'iuyrdfgjghgvybn5r6t77y')

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.token = token
    next()
  } catch(e) {
    res.status(401).send({error: 'Please authenticate user'})
  }
}

module.exports = auth