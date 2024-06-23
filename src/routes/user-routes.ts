import { Router } from 'express'
import {
  createUser,
  editUser,
  getUser,
  getUsers,
} from '../service/user-service'

const userRoutes = Router()

userRoutes.post('/create', createUser)

userRoutes.put('/edit/:userId', editUser)

userRoutes.get('/get/:userId', getUser)

userRoutes.get('/get', getUsers)

export { userRoutes }
