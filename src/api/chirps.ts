import { NextFunction, Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { validateChirp } from '../utils/validateChirp.js';
import { createChirp, getChirps, getChirp } from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../utils/auth.js';
import { config } from '../config.js';

export async function createChirpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.api.jwtSecret)

    const { body }: { body: string } = req.body;

    const formmatedBody = validateChirp(body)

    const chirp = await createChirp({ userId, body: formmatedBody })
    respondWithJSON(res, 201, chirp)
  } catch(err) {
    next(err)
  }
}

export async function getChirpsHandler(req: Request, res: Response) {
  const chirp = await getChirps()
  respondWithJSON(res, 200, chirp)
}

export async function getChirpHandler(req: Request, res: Response) {
  const chirpId = req.params.chirpId as string;

  if (!chirpId) {
    respondWithJSON(res, 400, {error: 'Bad request'})
    return;
  }
  const chirp = await getChirp(chirpId)
  if (chirp) {
    respondWithJSON(res, 200, chirp)
  } else {
    respondWithJSON(res, 404, {error: 'Not found'})
  }
}



