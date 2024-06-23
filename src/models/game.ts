import { User } from './user'

interface Game {
  gameId?: string
  players: {
    playerOneId: User['id']
    playerTwoId?: User['id']
    playerOneScore: number
    playerTwoScore: number
  }
  moves?: { playerId: User['id']; moveType: string }[]
  winner?: User['id']
}

function initGame(playerOneId: string): Game {
  return {
    gameId: crypto.randomUUID(),
    players: {
      playerOneId: playerOneId,
      playerOneScore: 0,
      playerTwoScore: 0,
    },
    moves: [],
    winner: undefined,
  }
}

export { Game, initGame }
