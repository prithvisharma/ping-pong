import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { database } from '../config/mongo'
import { CustomRequest } from '../models/custom-request'
import { initUser, User } from '../models/user'

const createUser = async (req: Request, res: Response) => {
  const { name, userId, password, defenseSetLength, role } = req.body
  if (!name || !userId || !password || !defenseSetLength || !role) {
    return res
      .status(400)
      .json({ ok: false, message: 'Invalid Request Body Data' })
  }
  const encryptedPassword = await bcrypt.hash(password, 10)
  const user: User = initUser({
    name,
    userId,
    password: encryptedPassword,
    defenseSetLength,
    role,
  })
  const dbResult = await database.users?.insertOne(user)
  if (dbResult?.acknowledged && dbResult?.insertedId) {
    return res.status(200).json({ ok: true, message: 'User Created' })
  } else {
    return res.status(500).json({ ok: false, message: 'Internal Server Error' })
  }
}

const editUser = async (req: CustomRequest, res: Response) => {
  return res.status(503).json({ ok: false, message: 'Endpoint Unavailable' })
}

const getUser = async (req: CustomRequest, res: Response) => {
  const { userId } = req.params
  const user = await database.users?.findOne({ userId: userId })
  if (!user)
    return res.status(404).json({ ok: false, message: 'User Not Found' })
  return res
    .status(200)
    .json({ ok: true, message: 'User Found', data: { user } })
}

const getUsers = async (req: CustomRequest, res: Response) => {
  const users = await database.users?.find().toArray()
  return res
    .status(200)
    .json({ ok: true, message: 'Users Found', data: { users } })
}

export { createUser, editUser, getUser, getUsers }
