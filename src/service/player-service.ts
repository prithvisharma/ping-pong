import { Request, Response } from 'express'

const joinGame = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Game Joined' })
}

const playerAttack = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Player attacked' })
}

const playerDefend = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Player Defended' })
}

export { joinGame, playerAttack, playerDefend }
