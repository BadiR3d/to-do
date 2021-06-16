const mongoose = require('mongoose')

mongoose.connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('db connected')
  }
})

