const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma.cjs')
const authMiddleware = require('../middleware/auth')

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Валидация на паролата
    if (password.length < 8) {
      return res.status(400).json({ error: 'Паролата трябва да е поне 8 знака' })
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Паролата трябва да съдържа поне една главна буква' })
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Паролата трябва да съдържа поне една цифра' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Имейлът вече съществува' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    })

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Грешка при регистрация' })
  }
})

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Невалиден имейл или парола' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Невалиден имейл или парола' })

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Грешка при вход' })
  }
})

// Профилна информация
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            comments: true,
          }
        }
      }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

module.exports = router