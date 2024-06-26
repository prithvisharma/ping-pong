import { Express, Router } from 'express'
import { gameRoutes } from './routes/game-routes'
import { loginRoutes } from './routes/login-routes'
import { userRoutes } from './routes/user-routes'

const routes = {
  '/game': gameRoutes,
  '/user': userRoutes,
  '/login': loginRoutes,
}

function registerRoute(app: Express, path: string, router: Router) {
  app.use(path, router)
}

function registerRoutes(app: Express) {
  Object.entries(routes).forEach(([path, route]) =>
    registerRoute(app, path, route)
  )
}

export { registerRoutes }
