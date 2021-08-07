const request = require('supertest')
const app = require('../src/app')
const { userOne, userOneId, populateDB } = require('./fixtures/db')

beforeEach(populateDB)
test('should signup new user', async () => {
  await request(app).post("/signup").send({
    name: 'john',
    surname: 'doe',
    email: 'john@doe.com',
    password: 'john@pass2',
    birthday: '0989787671',
    title: 'Mr',
  }).expect(200)
})

test('should login existing user', async () => {
  await request(app).post("/login").send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
})

test('should not login nonexisting user', async () => {
  await request(app).post("/login").send({
    email: userOne.email,
    password: 'didit2'
  }).expect(400)
})

test('should get existing user profile', async () => {
  await request(app)
    .get("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get nonexisting user profile', async () => {
  await request(app)
    .get("/users/me")
    .set('Authorization', `Bearer 0iohujgrfdyuyhkjhyhftftfuhyihugygyt`)
    .send()
    .expect(401)
})

test('should update existing user profile', async () => {
  await request(app)
    .patch("/users/me/update")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: 'testupdate@test.com'
    })
    .expect(200)
})

test('should not update nonauthorized existing user profile', async () => {
  await request(app)
    .patch("/users/me/update")
    .send({
      email: 'testupdate@test.com'
    })
    .expect(401)
})

test('should delete existing user profile', async () => {
  await request(app)
    .delete("/users/me/delete")
    .auth(userOne.tokens[0].token, { type: `Bearer` })
    .send()
    .expect(200)
})

test('should not delete unauthorized existing user profile', async () => {
  await request(app)
    .delete("/users/me/delete")
    .send()
    .expect(401)
})

test('should get existing user profile avatar', async () => {
  await request(app)
    .get("/users/me/avatar")
    .set({
      Authorization: `Bearer ${userOne.tokens[0].token}`
    })
    .send()
    .expect(200)
})