const express = require('express')
const router = express.Router()
const prisma = require('../prisma.cjs')
const authMiddleware = require('../middleware/auth')

// Изпрати съобщение
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body
    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId: parseInt(receiverId)
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      }
    })
    res.json(message)
  } catch (err) {
    console.error('Message error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Всички разговори на потребителя
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Групирай по събеседник
    const conversations = {}
    messages.forEach(m => {
      const other = m.senderId === req.user.id ? m.receiver : m.sender
      if (!conversations[other.id]) {
        conversations[other.id] = { user: other, lastMessage: m, unread: 0 }
      }
      if (!m.read && m.receiverId === req.user.id) {
        conversations[other.id].unread++
      }
    })

    res.json(Object.values(conversations))
  } catch (err) {
    console.error('Conversations error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Информация за потребител
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, name: true }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

// Разговор с конкретен потребител
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const otherId = parseInt(req.params.userId)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherId },
          { senderId: otherId, receiverId: req.user.id }
        ]
      },
      include: {
        sender: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Маркирай като прочетени
    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: req.user.id, read: false },
      data: { read: true }
    })

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})



module.exports = router