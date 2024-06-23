import { Response } from 'express'
import { database } from '../config/mongo'
import { MoveTypes } from '../constant/move-types'
import { CustomRequest } from '../models/custom-request'
import { Game, initGame } from '../models/game'
import { Move } from '../models/move'

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
    const game: Game | null | undefined = await database.games?.findOne<Game>({
      gameId: gameId,
    })
    if (!game) {
      return res.status(404).json({ ok: false, message: 'Game Not Found' })
    }
    if (game.players.playerOneId === userId) {
      return res
        .status(409)
        .json({ ok: false, message: 'Both Players Cannot Be Same' })
    }
    if (typeof game.players.playerTwoId === 'string') {
      return res
        .status(409)
        .json({ ok: false, message: 'Game Full, Create New Game' })
    }
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
  const userId = req.user.userId
  const attackKey = Number(req.body.attackKey)
  if (!attackKey || attackKey < 1 || attackKey > 10) {
    return res.status(400).json({ ok: false, message: 'Invalid Attack Key' })
  }
  const gameId = req.body.gameId
  const game: Game | null | undefined = await database.games?.findOne<Game>({
    gameId: gameId,
  })
  if (!game) {
    return res.status(404).json({ ok: false, message: 'Game Not Found' })
  }
  if (game.winner) {
    return res.status(403).json({ ok: false, message: 'Game Completed' })
  }
  if (
    userId !== game.players.playerOneId ||
    userId !== game.players.playerTwoId
  ) {
    return res.status(403).json({ ok: false, message: 'Cannot play this game' })
  }
  const moveType = MoveTypes.Attack
  const gameMoves = game.moves
  const move: Move = {
    userId: userId,
    moveType: moveType,
    attackKey: attackKey,
  }
  let validMove: boolean = false
  if (gameMoves?.length) {
    const lastMove: Move = gameMoves[gameMoves.length - 1]
    if (lastMove.moveType === MoveTypes.Attack) {
      return res.status(400).json({ ok: false, message: 'Cannot attack twice' })
    }
    if (lastMove.userId === userId && lastMove.moveType === MoveTypes.Defence) {
      validMove = true
    }
  } else {
    validMove = true
  }
  if (validMove) {
    const updateResult = await database.games?.updateOne(
      { gameId },
      { $push: { moves: move as any } }
    )
    if (updateResult?.modifiedCount === 1) {
      return res.json({ ok: true, message: 'Player attacked' })
    } else {
      return res
        .status(500)
        .json({ ok: false, message: 'Failed to update game' })
    }
  }
}

const playerDefend = async (req: CustomRequest, res: Response) => {
  const userId = req.user.userId
  const maxDefenseSetLength = Number(req.user.defenseSetLength)
  if (isNaN(maxDefenseSetLength)) {
    return res
      .status(400)
      .json({ ok: false, message: 'Update User Defence Set' })
  }
  const gameId = req.body.gameId
  const game: Game | null | undefined = await database.games?.findOne<Game>({
    gameId: gameId,
  })
  if (!game) {
    return res.status(404).json({ ok: false, message: 'Game Not Found' })
  }
  if (game.winner) {
    return res.status(403).json({ ok: false, message: 'Game Completed' })
  }
  if (
    userId !== game.players.playerOneId &&
    userId !== game.players.playerTwoId
  ) {
    return res.status(403).json({ ok: false, message: 'Cannot play this game' })
  }
  const defenceGrid = req.body.defenceGrid
  if (
    !Array.isArray(defenceGrid) ||
    !defenceGrid?.length ||
    defenceGrid.length > maxDefenseSetLength
  ) {
    return res.status(400).json({ ok: false, message: 'Invalid Defence Grid' })
  }
  const moveType = MoveTypes.Defence
  const gameMoves = game.moves
  const move: Move = {
    userId: userId,
    moveType: moveType,
    defenceGrid: defenceGrid,
  }
  if (!gameMoves?.length) {
    return res
      .status(400)
      .json({ ok: false, message: 'Defend cannot be the first move' })
  }
  const lastMove = gameMoves[gameMoves.length - 1]
  if (lastMove.moveType === MoveTypes.Defence) {
    return res.status(400).json({ ok: false, message: 'Cannot defend twice' })
  }
  if (lastMove.userId !== userId && lastMove.moveType === MoveTypes.Attack) {
    const attackKey = lastMove.attackKey
    let playerOneScore: number = Number(game.players.playerOneScore)
    let playerTwoScore: number = Number(game.players.playerTwoScore)
    if (defenceGrid.includes(attackKey)) {
      if (userId === game.players.playerOneId) playerOneScore++
      else playerTwoScore++
    } else {
      if (userId !== game.players.playerOneId) playerOneScore++
      else playerTwoScore++
    }
    let winner = undefined
    if (playerOneScore === 5) winner = game.players.playerOneId
    if (playerTwoScore === 5) winner = game.players.playerTwoId

    const updateResult = await database.games?.updateOne(
      { gameId },
      {
        $set: {
          'players.playerOneScore': playerOneScore,
          'players.playerTwoScore': playerTwoScore,
          winner: winner,
        },
        $push: {
          moves: move as any,
        },
      }
    )
    if (updateResult?.modifiedCount === 1) {
      return res.json({ ok: true, message: 'Player Defended' })
    } else {
      return res
        .status(500)
        .json({ ok: false, message: 'Failed to update game' })
    }
  }
}

export { getAllGames, getGame, joinGame, playerAttack, playerDefend }
