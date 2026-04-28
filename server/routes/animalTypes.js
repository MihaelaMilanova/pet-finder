const express = require('express')
const router = express.Router()
const prisma = require('../prisma.cjs')

router.get('/', async (req, res) => {
  try {
    const types = await prisma.animalType.findMany({ include: { breeds: true } })
    res.json(types)
  } catch (err) {
    res.status(500).json({ error: 'Грешка' })
  }
})

module.exports = router