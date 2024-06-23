import { Collection, MongoClient } from 'mongodb'

interface Database {
  players?: Collection
  games?: Collection
}

const database: Database = {}

const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017'

const client = new MongoClient(url)

const connectToDatabase = async (): Promise<void> => {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    const dbClient = client.db('pingpong')
    database.players = dbClient.collection('players')
    database.games = dbClient.collection('games')
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error)
    throw error
  }
}

export { connectToDatabase, database }
