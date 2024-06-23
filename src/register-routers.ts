import { Express, Router } from 'express'
import { loginRoutes } from './routes/login-routes'
import { playerRoutes } from './routes/player-routes'
import { refereeRoutes } from './routes/referee-routes'
import { userRoutes } from './routes/user-routes'

const routes = {
  '/referee': refereeRoutes,
  '/player': playerRoutes,
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
