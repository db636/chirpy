import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.api.fileserverHits = config.api.fileserverHits + 1
  next()
}

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    console.log(res.statusCode)
    if (res.statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
    }
  })
  next()
}