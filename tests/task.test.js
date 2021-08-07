const request = require('supertest')
const app = require('../src/app')
const { userOne, userOneId, populateDB } = require('./fixtures/db')
const Task = require('../src/models/task')

test('should create task', () => {
  request(app)
    .post('/tasks/create-task')
})
