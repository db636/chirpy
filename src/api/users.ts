import { Request, Response } from "express";
import { createUser, getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash, hashPassword } from '../utils/auth.js';
import { UserResponse } from "../db/schema.js";
import { respondWithJSON } from './json.js';

export async function handlerCreateUser(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPwd = await hashPassword(password)
  const user = await createUser({ email, hashedPassword: hashedPwd })
  const { hashedPassword, ...userRest} = user ?? {}

  const userToRes: UserResponse = userRest

  respondWithJSON(res, 201, userToRes)
}

export async function handlerLogin(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    respondWithJSON(res, 400, {error: "Bad request"})
  }

  try {
    const user = await getUserByEmail(email)
    
    const { hashedPassword, ...userRest} = user ?? {}

    const isValidPwd = await checkPasswordHash(password, user.hashedPassword)
    if (isValidPwd) {
      respondWithJSON(res, 200, userRest)
    } else {
      throw new Error()
    }
  } catch {
    respondWithJSON(res, 401, {error: "Unauthorized"})
  }
}
