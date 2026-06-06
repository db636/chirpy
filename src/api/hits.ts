import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from './errors.js';

export function handlerHits(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8")
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`)
}

export async function handlerHitsReset(req: Request, res: Response) {
  console.log('config.api.paltform', config.api.paltform)
  if (config.api.paltform !== "dev") {
    throw new ForbiddenError('Forbidden')
  }
  config.api.fileserverHits = 0
  res.set("Content-Type", "text/plain; charset=utf-8")
  res.send(`Hits: ${config.api.fileserverHits}`)

  await deleteAllUsers()
}
