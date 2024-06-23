import { Router } from 'express'
import { auth } from '../middleware/authentication-middleware'
import {
  getAllGames,
  getGame,
  joinGame,
  playerAttack,
  playerDefend,
} from '../service/game-service'

const gameRoutes = Router()

gameRoutes.get('/all', auth(), getAllGames)

gameRoutes.get('/id/:gameId', auth(), getGame)

gameRoutes.post('/join', auth(), joinGame)

gameRoutes.post('/attack', auth(), playerAttack)

gameRoutes.post('/defend', auth(), playerDefend)

export { gameRoutes }
