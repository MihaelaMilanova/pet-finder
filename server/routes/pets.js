const express = require('express')
const router = express.Router()
const prisma = require('../prisma.cjs')
const authMiddleware = require('../middleware/auth')

// Всички обяви
router.get('/', async (req, res) => {
  try {
    const { status, animalTypeId } = req.query
    const where = {}
    if (status) where.status = status
    if (animalTypeId) where.animalTypeId = parseInt(animalTypeId)

    const pets = await prisma.pet.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        animalType: true,
        breed: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(pets)
  } catch (err) {
    res.status(500).json({ error: 'Грешка при зареждане на обявите' })
  }
})

// Моите обяви
router.get('/my/pets', authMiddleware, async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { userId: req.user.id },
      include: {
        animalType: true,
        breed: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(pets)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

// Една обява
router.get('/:id', async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        animalType: true,
        breed: true,
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    if (!pet) return res.status(404).json({ error: 'Обявата не е намерена' })
    res.json(pet)
  } catch (err) {
    res.status(500).json({ error: 'Грешка при зареждане на обявата' })
  }
})

// Създаване на обява
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, color, age, imageUrl, location, animalTypeId, breedId } = req.body
    const pet = await prisma.pet.create({
      data: {
        title,
        description,
        status,
        color,
        age: age ? parseInt(age) : null,
        imageUrl,
        location,
        userId: req.user.id,
        animalTypeId: parseInt(animalTypeId),
        breedId: breedId ? parseInt(breedId) : null,
      }
    })
    res.json(pet)
  } catch (err) {
    res.status(500).json({ error: 'Грешка при създаване на обява' })
  }
})

// Промяна на статус
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const pet = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!pet) return res.status(404).json({ error: 'Обявата не е намерена' })
    if (pet.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Нямаш права' })
    }
    const updated = await prisma.pet.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Грешка при промяна на статус' })
  }
})

// Изтриване на обява
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!pet) return res.status(404).json({ error: 'Обявата не е намерена' })
    if (pet.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Нямаш права' })
    }
    await prisma.comment.deleteMany({ where: { petId: pet.id } })
    await prisma.pet.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Обявата е изтрита' })
  } catch (err) {
    res.status(500).json({ error: 'Грешка при изтриване' })
  }
})

module.exports = router