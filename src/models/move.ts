import { User } from './user'

interface Move {
  userId: User['userId']
  moveType: string
  attackKey?: number
  defenceGrid?: number[]
}

export { Move }
