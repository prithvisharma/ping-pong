import { Response } from 'express'
import { CustomRequest } from '../models/custom-request'

const joinGame = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Game Joined' })
}

const playerAttack = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player attacked' })
}

const playerDefend = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player Defended' })
}

export { joinGame, playerAttack, playerDefend }
