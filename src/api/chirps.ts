import { NextFunction, Request, Response } from "express";

import { respondWithError, respondWithJSON } from "./json.js";
import { validateChirp } from '../utils/validateChirp.js';
import { createChirp, getChirps, getChirp, deleteChirp } from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../utils/auth.js';
import { config } from '../config.js';
import { BadRequestError, NotFoundError, ForbiddenError } from './errors.js';

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

export async function handlerChirpsDelete(req: Request, res: Response, next: NextFunction) {
  try {
    const { chirpId } = req.params;

    if (typeof chirpId !== "string") {
      throw new BadRequestError("Invalid chirp ID");
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.jwtSecret);

    const chirp = await getChirp(chirpId);
    if (!chirp) {
      throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    if (chirp.userId !== userId) {
      throw new ForbiddenError("You can't delete this chirp");
    }

    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
      throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }

    res.status(204).send();
  } catch(err) {
    next(err)
  }
}
