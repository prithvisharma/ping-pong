import { Response } from 'express'
import { database } from '../config/mongo'
import { CustomRequest } from '../models/custom-request'
import { Game, initGame } from '../models/game'

const getAllGames = async (req: CustomRequest, res: Response) => {
  const games = await database.games?.find().toArray()
  return res
    .status(200)
    .json({ ok: true, message: 'Users Found', data: { games } })
}

const joinGame = async (req: CustomRequest, res: Response) => {
  const gameId = req.body?.gameId
  const createNewGame = Boolean(req.body?.createNewGame)
  const userId = req.user.userId

  if (createNewGame) {
    const game = initGame(userId)
    const dbResult = await database.games?.insertOne(game)
    if (dbResult?.acknowledged && dbResult?.insertedId) {
      return res.status(200).json({ ok: true, message: 'Game Created' })
    } else {
      return res
        .status(500)
        .json({ ok: false, message: 'Internal Server Error' })
    }
  } else {
    const dbGame: Game | null | undefined = await database.games?.findOne<Game>(
      {
        gameId: gameId,
      }
    )
    if (!dbGame) {
      return res.status(404).json({ ok: false, message: 'Game Not Found' })
    }
    console.log(dbGame)
  }

  return res.json({ ok: true, message: 'Game Joined' })
}

const playerAttack = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player attacked' })
}

const playerDefend = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player Defended' })
}

export { getAllGames, joinGame, playerAttack, playerDefend }
