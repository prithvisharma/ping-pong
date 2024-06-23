import { Request, Response } from 'express'

const getReportByGameId = async (req: Request, res: Response) => {
  return res.json({ ok: true, message: 'Game Report Fetched' })
}

export { getReportByGameId }
