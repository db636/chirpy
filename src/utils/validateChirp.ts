import { BadRequestError } from '../api/errorHandler.js';

const WORDS = ['kerfuffle', 'sharbert', 'fornax']
const replacer = '****'
const re = /[A-Za-z]/

export function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError('Chirp is too long. Max length is 140')
  }

  let formmatedBody = ''
  let temp = ''

  for (let i = 0; i < body.length; i++) {
    if (re.test(body[i])) {
      temp += body[i]
      if (i === body.length - 1) {
        formmatedBody += temp
      }
    } else {
      if (WORDS.includes(temp.toLowerCase())) {
        formmatedBody += replacer
      } else {
        formmatedBody += temp
      }
      formmatedBody += body[i]
      temp = ''
    }
  }

  return formmatedBody
}