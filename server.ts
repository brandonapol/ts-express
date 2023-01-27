import express from 'express'
import dotenv from 'dotenv'
const port = process.env.PORT || 5000
import { connectDB } from './config/db'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use('/api/contacts', require('./routes/goalRoutes'))

app.listen(port, () => console.log(`Server started on port ${port}`))