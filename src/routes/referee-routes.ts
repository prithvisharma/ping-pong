import { Router } from 'express'
import { getReportByGameId } from '../service/referee-service'

const refereeRoutes = Router()

refereeRoutes.get('/report/:gameId', getReportByGameId)

export { refereeRoutes }
