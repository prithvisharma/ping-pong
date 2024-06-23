import { Router } from 'express'
import { auth } from '../middleware/authentication-middleware'
import {
  createUser,
  editUser,
  getUser,
  getUsers,
} from '../service/user-service'

const userRoutes = Router()

userRoutes.post('/create', createUser)

userRoutes.put('/edit', auth(), editUser)

userRoutes.get('/get', auth(), getUser)

userRoutes.get('/get/all', auth(), getUsers)

export { userRoutes }
