import { Player } from './player'

export interface Game {
  _id?: string
  player1: Player['_id']
  player2: Player['_id']
  score1: number
  score2: number
}
