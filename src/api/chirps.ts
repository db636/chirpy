import { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { validateChirp } from '../utils/validateChirp.js';
import { createChirp } from '../db/queries/chirps.js';


export async function handlerChirps(req: Request, res: Response) {
  console.log(1111)
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  const formmatedBody = validateChirp(params.body)

  const chirp = await createChirp({ ...params, body: formmatedBody })
  respondWithJSON(res, 201, chirp)
}



