import { Router } from 'express'
import { joinGame, playerAttack, playerDefend } from '../service/player-service'

const playerRoutes = Router()

playerRoutes.post('/join', joinGame)

playerRoutes.post('/attack', playerAttack)

playerRoutes.post('/defend', playerDefend)

export { playerRoutes }
