import { Request, Response } from 'express'

const login = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'User logged In' })
}

export { login }
