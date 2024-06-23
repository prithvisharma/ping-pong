import { Router } from 'express'
import { createUser, editUser, getUser } from '../service/user-service'

const userRoutes = Router()

userRoutes.post('/create', createUser)

userRoutes.put('/edit', editUser)

userRoutes.get('/get/:userId', getUser)

export { userRoutes }
