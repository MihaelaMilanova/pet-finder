const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: 'https://pet-finder-wine.vercel.app'
}))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/pets', require('./routes/pets'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/animal-types', require('./routes/animalTypes'))
app.use('/api/messages', require('./routes/messages'))
app.use('/api/upload', require('./routes/upload'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Сървърът работи на порт ${PORT}`)
})