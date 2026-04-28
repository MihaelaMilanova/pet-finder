const express = require('express')
const router = express.Router()
const prisma = require('../prisma.cjs')
const authMiddleware = require('../middleware/auth')

// Middleware за admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Само за администратори' })
  next()
}

// Всички потребители
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

// Смяна на роля
router.patch('/users/:id/role', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { role } = req.body
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role }
    })
    res.json({ id: user.id, role: user.role })
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

// Всички видове животни (за админ)
router.get('/animal-types', authMiddleware, adminOnly, async (req, res) => {
  try {
    const types = await prisma.animalType.findMany({ include: { breeds: true } })
    res.json(types)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

// Добавяне на вид животно
router.post('/animal-types', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name } = req.body
    const type = await prisma.animalType.create({ data: { name } })
    res.json(type)
  } catch (err) {
    console.error('Animal type error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Добавяне на порода
router.post('/breeds', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, animalTypeId } = req.body
    const breed = await prisma.breed.create({
      data: { name, animalTypeId: parseInt(animalTypeId) }
    })
    res.json(breed)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

module.exports = router