const express = require('express')
const router = express.Router()
const prisma = require('../prisma.cjs')
const authMiddleware = require('../middleware/auth')

// Добавяне на коментар
router.post('/:petId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        petId: parseInt(req.params.petId)
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    })
    res.json(comment)
  } catch (err) {
    res.status(500).json({ error: 'Грешка при добавяне на коментар' })
  }
})

// Изтриване на коментар
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!comment) return res.status(404).json({ error: 'Коментарът не е намерен' })
    if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Нямаш права' })
    }
    await prisma.comment.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Коментарът е изтрит' })
  } catch (err) {
    res.status(500).json({ error: 'Грешка при изтриване на коментар' })
  }
})

module.exports = router