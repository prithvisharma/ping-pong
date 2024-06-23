import { User } from './user'

interface Game {
  id?: string
  players: {
    playerOneId: User['id']
    playerTwoId: User['id']
    playerOneScore: number
    playerTwoScore: number
  }
  moves?: { playerId: User['id']; moveType: string }[]
  winner?: User['id']
}

function initGame(playersData: {
  playerOneId: User['id']
  playerTwoId: User['id']
}): Game {
  const { playerOneId, playerTwoId } = playersData
  return {
    id: crypto.randomUUID(),
    players: {
      playerOneId: playerOneId,
      playerTwoId: playerTwoId,
      playerOneScore: 0,
      playerTwoScore: 0,
    },
    moves: [],
    winner: undefined,
  }
}

export { Game, initGame }
