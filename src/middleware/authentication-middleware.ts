import { NextFunction, Response } from 'express'
import { CustomRequest } from '../models/custom-request'
import { verifyToken } from '../security/jwt-manager'

function auth() {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    let jwtToken
    try {
      jwtToken = req.header('Authorization')?.split(' ')[1]
      if (!jwtToken)
        throw new Error('Authorization header is missing or invalid')
    } catch (error) {
      console.log('Authorization error:', error)
      return res.status(401).json({ error: ['Invalid JWT used'] })
    }
    try {
      const verifiedToken = await verifyToken(jwtToken)
      if (!verifiedToken) {
        return res.status(401).json({ error: ['Invalid JWT used'] })
      }
      req.user = verifiedToken.jwtPayload
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      return res.status(401).json({ error: ['Invalid JWT used'] })
    }
  }
}

export { auth }
