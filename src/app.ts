import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectToDatabase } from './config/mongo'
import { registerRoutes } from './register-routers'

const port = process.env.PORT

const app = express()

app.use(express.json())

registerRoutes(app)

app.listen(port, async () => {
  await connectToDatabase()
  console.log(`Server running on port ${port}`)
})
