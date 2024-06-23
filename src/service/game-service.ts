import { Response } from 'express'
import { database } from '../config/mongo'
import { CustomRequest } from '../models/custom-request'
import { Game, initGame } from '../models/game'

const getAllGames = async (req: CustomRequest, res: Response) => {
  const games = await database.games?.find().toArray()
  return res
    .status(200)
    .json({ ok: true, message: 'Games Found', data: { games } })
}

const getGame = async (req: CustomRequest, res: Response) => {
  const gameId = req.params.gameId
  const game: Game | null | undefined = await database.games?.findOne<Game>({
    gameId: gameId,
  })
  if (!game)
    return res.status(404).json({ ok: false, message: 'Game Not Found' })
  return res
    .status(200)
    .json({ ok: true, message: 'Game Found', data: { game } })
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
    const updateResult = await database.games?.updateOne(
      { gameId: gameId },
      { $set: { 'players.playerTwoId': userId } }
    )

    if (updateResult?.modifiedCount === 1) {
      return res.status(200).json({ ok: true, message: 'Game Joined' })
    } else {
      return res
        .status(500)
        .json({ ok: false, message: 'Failed to update game' })
    }
  }
}

const playerAttack = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player attacked' })
}

const playerDefend = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Player Defended' })
}

export { getAllGames, getGame, joinGame, playerAttack, playerDefend }
