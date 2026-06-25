import { Request, Response } from "express";
import { addUserToChirpyRed, createUser, getUserByEmail, updateUser } from '../db/queries/users.js';
import { checkPasswordHash, getAPIKey, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from '../utils/auth.js';
import { config } from '../config.js';
import { UserResponse } from "../db/schema.js";
import { respondWithJSON } from './json.js';
import { createRefreshToken, getUserFromRefreshToken, revokeRefreshToken } from '../db/queries/refreshTokens.js';
import { NotFoundError, UnauthorizedError } from './errors.js';

export async function handlerCreateUser(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPwd = await hashPassword(password)
  const user = await createUser({ email, hashedPassword: hashedPwd })
  const { hashedPassword, ...userRest} = user ?? {}

  const userToRes: UserResponse = userRest

  respondWithJSON(res, 201, userToRes)
}

const JWT_EXPIRATION_TIME = 60 * 60 // 1h default
const RT_EXPIRATION_TIME = 60 * 60 * 24 * 60 // 60 days
export async function handlerLogin(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    respondWithJSON(res, 400, {error: "Bad request"})
  }

  try {
    const user = await getUserByEmail(email)
    const refreshToken = await makeRefreshToken()
    await createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(new Date().getTime() + RT_EXPIRATION_TIME * 1000)
    })
    
    const { hashedPassword, ...userRest} = user ?? {}

    const isValidPwd = await checkPasswordHash(password, user.hashedPassword)
    if (isValidPwd) {
      const token = makeJWT(user.id, JWT_EXPIRATION_TIME, config.api.jwtSecret)
      respondWithJSON(res, 200, {...userRest, token, refreshToken})
    } else {
      throw new Error()
    }
  } catch {
    respondWithJSON(res, 401, {error: "Unauthorized"})
  }
}

export async function handlerRefreshToken(req: Request, res: Response) {
  const token = getBearerToken(req)
  const user = await getUserFromRefreshToken(token)

  if (!user) {
    throw new UnauthorizedError('Invalid token')
  }

  const accessToken = makeJWT(user.id, JWT_EXPIRATION_TIME, config.api.jwtSecret)
  respondWithJSON(res, 200, { token: accessToken })
}

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
  const token = getBearerToken(req)
  
  if (!token) {
    throw new UnauthorizedError('Invalid token')
  }

  await revokeRefreshToken(token)
  respondWithJSON(res, 204, {})
}

export async function handlerUpdateUser(req: Request, res: Response) {
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.api.jwtSecret)
  const email = req.body.email;
  const password = req.body.password;
  const hashedPwd = await hashPassword(password)
  const user = await updateUser(userId, { email, hashedPassword: hashedPwd })
  const { hashedPassword, ...userRest} = user ?? {}

  const userToRes: UserResponse = userRest

  respondWithJSON(res, 200, userToRes)
}

export async function handlerPolkaWebhook(req: Request, res: Response) {
  const event = req.body.event;
  const data = req.body.data;
  if (getAPIKey(req) !== config.api.polkaKey) {
    throw new UnauthorizedError("Unauthorized")
  }

  if (event === "user.upgraded" && data.userId) { 
    const updatedUser = await addUserToChirpyRed(data.userId)
    if (updatedUser) {
      respondWithJSON(res, 204, {})
    } else {
      throw new NotFoundError('user not found')
    }
  } else {
    respondWithJSON(res, 204, { message: 'event is not supported' })
  }
}