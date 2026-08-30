import express from 'express'
import cors from 'cors'
// import morgan from 'morgan'
import rawgRoutes from '@/routes/rawgRoutes'
import { errorHandler } from '@/middleware/errorHandler'

const app = express()

app.use(cors())
// app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => res.send('OK'))
app.use('/api', rawgRoutes)
app.use(errorHandler)

export default app
