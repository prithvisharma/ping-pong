import { Router } from 'express'
import { login } from '../service/login-service'

const loginRoutes = Router()

loginRoutes.post('/', login)

export { loginRoutes }
