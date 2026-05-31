const request = require('supertest')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', require('../routes/auth'))
app.use('/api/pets', require('../routes/pets'))

let token = ''

beforeAll(async () => {
  // Регистрираме тестов потребител и вземаме токен
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Тест Потребител',
      email: `pets${Date.now()}@test.com`,
      password: 'Test1234'
    })
  token = res.body.token
})

describe('Обяви', () => {

  test('Зареждане на всички обяви', async () => {
    const res = await request(app).get('/api/pets')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('Създаване на обява без токен', async () => {
    const res = await request(app)
      .post('/api/pets')
      .send({ title: 'Тест' })
    expect(res.statusCode).toBe(401)
  })

  test('Достъп до несъществуваща обява', async () => {
    const res = await request(app).get('/api/pets/99999')
    expect(res.statusCode).toBe(404)
  })

})

afterAll(async () => {
  const prisma = require('../prisma.cjs')
  await prisma.$disconnect()
})