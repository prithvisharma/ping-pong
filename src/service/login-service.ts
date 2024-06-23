import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { database } from '../config/mongo'
import { createToken } from '../security/jwt-manager'

const login = async (req: Request, res: Response) => {
  const { userId, password } = req.body
  if (!userId || !password) {
    return res
      .status(400)
      .json({ ok: false, message: 'Invalid Request Body Data' })
  }
  const user = await database.users?.findOne({ userId: userId })
  if (!user)
    return res.status(404).json({ ok: false, message: 'User Not Found' })
  const verifyPassowrd = await bcrypt.compare(password.trim(), user.password)
  if (!verifyPassowrd) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid Credentials',
    })
  }
  const token = await createToken({ user })
  return res.json({ ok: true, message: 'User logged In', token: token })
}

export { login }
