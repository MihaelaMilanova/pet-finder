const request = require('supertest')
const express = require('express')
const cors = require('cors')

// Създаване на тестово приложение
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', require('../routes/auth'))

describe('Автентикация', () => {

  test('Регистрация с валидни данни', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Тест Потребител',
        email: `test${Date.now()}@test.com`,
        password: 'Test1234'
      })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toHaveProperty('role', 'USER')
  })

  test('Регистрация с дублиран имейл', async () => {
    const email = `dup${Date.now()}@test.com`
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email, password: 'Test1234' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email, password: 'Test1234' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Имейлът вече съществува')
  })

  test('Регистрация с кратка парола', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Тест',
        email: `short${Date.now()}@test.com`,
        password: '123'
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Паролата трябва да е поне 8 знака')
  })

  test('Вход с валидни данни', async () => {
    const email = `login${Date.now()}@test.com`
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email, password: 'Test1234' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Test1234' })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  test('Вход с грешна парола', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'ГрешнаПарола1' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Невалиден имейл или парола')
  })

})

afterAll(async () => {
  const prisma = require('../prisma.cjs')
  await prisma.$disconnect()
})