import { Request, Response } from 'express'

const createUser = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Game Joined' })
}

const editUser = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Player attacked' })
}

const getUser = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Player Defended' })
}

export { createUser, editUser, getUser }
