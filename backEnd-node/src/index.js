import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'

import authRouter from './routes/authRoutes.js'
import transactionRouter from './routes/transactionRoutes.js'
import savingRouter from './routes/savingRoutes.js'

import connectDB from './database/connect.js'

import authMiddleware from './middlewares/authMiddleware.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/transactions', authMiddleware, transactionRouter)
app.use('/api/savings', authMiddleware, savingRouter)

app.get('/', (req, res) => {
  res.send('Teste')
})

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/myFinanceiro';
    connectDB(MONGODB_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
