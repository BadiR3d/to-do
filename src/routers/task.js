const express = require('express')
const Task = require("../models/task");
const auth = require('../middleware/auth');
const router = new express.Router()

router.post("/tasks/create-task", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    task.save()
    res.status(201).send(task);
  } catch(e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const path = 'tasks'
  const match = {}
  const limit = parseInt(req.query.limit)
  const skip = parseInt(req.query.skip)
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.name) {
    match.name = req.query.name
  }

  if (req.query.sort) {
    const parts = req.query.sort.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    console.log('sort: ', sort)
  }

  try {
    await req.user.populate({
      path,
      match,
      options: {
        limit,
        skip,
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch(e) {
    res.status(500).send(e);
  }
})

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send({ message: `Task not found` })
    }
    res.send(task)
  } catch(e) {
    res.status(500).send(e)
  }
})

router.patch("/tasks/update-task/:id", auth, async (req, res) => {
  const _id = req.params.id
  const body = req.body
  const updates = Object.keys(body)
  const allowedUpdates = ['name', 'description', 'completed']
  const isValidOperation = updates.every((item) => allowedUpdates.includes(item))
  
  if (!isValidOperation) {
    return res.status(400).send({ error: 'You have provided an invalid property. Please try again with valid property'})
  }

  try {

    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({ message: `Task with ${_id} not found` })
    }

    updates.forEach((item) => task[item] = body[item])

    await task.save();
    res.send(task)
  } catch(e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch(e) {
    res.status(400).send(e);
  }
})

module.exports = router;