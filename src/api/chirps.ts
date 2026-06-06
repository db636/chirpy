import { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { validateChirp } from '../utils/validateChirp.js';
import { createChirp, getChirps, getChirp } from '../db/queries/chirps.js';
import { error } from 'node:console';


export async function createChirpHandler(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  const formmatedBody = validateChirp(params.body)

  const chirp = await createChirp({ ...params, body: formmatedBody })
  respondWithJSON(res, 201, chirp)
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



