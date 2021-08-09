const express = require('express')
const User = require("../models/user")
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require("multer")
const sharp = require("sharp")
const e = require('express')

router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateToken()
    res.send({ user, token })
  } catch(e) {
    console.log(e)
    res.status(400).send(e);
  } 
});

router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(email, password)

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateToken()

    if (!user) {
      console.log(e)
      // res.status(400).send(e)
      return res.status(400).send({ error: 'You have provided invalid credentials. Please try again with valid credentials'})
    }

    res.send({ user, token })
  } catch(e) {
      console.log(e)
      res.status(400).send(e)
  }
})

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()

    res.send({success: 'User logged out succesfully.'})
  } catch(e) {
    res.status(500).send(e)
  }
})

router.post('/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()

    res.send({success: 'User logged out of all devices succesfully.'})
  } catch(e) {
    res.status(500).send(e)
  }
})

router.get("/users", auth,  async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
    console.log("in users")
  } catch (err) {
    console.log("in users e: ", e)
    res.status(500).send(e)
  }
})

router.get("/users/me", auth,  async (req, res) => {
  res.send(req.user)
})

router.patch("/users/me/update", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'surname', 'birthday', 'title']
  const isValidOperation = updates.every((item) => allowedUpdates.includes(item))
  
  if (!isValidOperation) {
    return res.status(400).send({ error: 'You have provided an invalid property. Please try again with valid property'})
  }

  try {
    updates.forEach((item) => req.user[item] = req.body[item])
    await req.user.save();
    res.send(req.user);
  } catch(e) {
    res.status(500).send(e)
  }
})

router.delete('/users/me/delete', auth, async (req, res) => {
  try {
    await req.user.remove()

    res.send(req.user)
  } catch(e) {
    res.status(400).send(e);
  }
})

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  }
})

router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({
    width: 250,
    height: 250
  }).png().toBuffer()

  req.user.avatar = buffer

  await req.user.save()

  res.send({message: 'image upload successful'});
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

router.get("/users/me/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user.avatar) {
      return new Error({ message: 'user does not have an avatar'})
    }

    res.set('Content-Type', 'image/*')

    res.send(user.avatar);
  } catch (err) {
    res.status(400).send({error: error.message})
  }
})

router.delete("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
  req.user.avatar = undefined

  await req.user.save()

  res.send({message: 'image delete successful'});
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

module.exports = router;
