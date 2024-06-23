import { Response } from 'express'
import { CustomRequest } from '../models/custom-request'

const getReportByGameId = async (req: CustomRequest, res: Response) => {
  return res.json({ ok: true, message: 'Game Report Fetched' })
}

export { getReportByGameId }
