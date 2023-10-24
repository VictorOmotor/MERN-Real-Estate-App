import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { router as userRouter } from './src/routers/user.route.js'
import { router as authRouter } from './src/routers/auth.route.js'
import { router as listingRouter } from './src/routers/listing.route.js'
import { globalErrorHandler } from './src/utils/errorHandler.js'
import { config } from './src/config/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'


const __dirname = path.resolve()

const app = express()

app.use(cors())

mongoose
  .connect(config.mongodb_connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection established'))
  .catch((e) => console.log('Mongo connection error: ', e.message))

const port = config.port || 5000

// Middlewares
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'dist', 'index.html'))
})

app.use(globalErrorHandler)

// Setting up the express server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
