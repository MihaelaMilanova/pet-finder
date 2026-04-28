const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma.cjs')

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

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

module.exports = router