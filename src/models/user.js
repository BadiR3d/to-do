const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  birthday: {
    type: Date,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function (next) {
  const user = this

  Task.deleteMany({ owner: user._id })

  next()
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
  const user = this

  const userObj = user.toObject()

  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;

  return userObj
}

userSchema.methods.generateToken =  async function () {
  const user = this

  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET)

  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token
}


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("Unable to login user.")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Unable to login user.")
  }

  return user
}

const User = mongoose.model("User", userSchema);

module.exports = User;
