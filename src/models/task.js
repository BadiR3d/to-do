const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
})

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
