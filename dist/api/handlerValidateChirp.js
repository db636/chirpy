import { respondWithJSON } from "./json.js";
import { BadRequestError } from './errorHandler.js';
const WORDS = ['kerfuffle', 'sharbert', 'fornax'];
const replacer = '****';
const re = /[A-Za-z]/;
export async function handlerValidateChirp(req, res) {
    const params = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError('Chirp is too long. Max length is 140');
    }
    let formmatedBody = '';
    let temp = '';
    for (let i = 0; i < params.body.length; i++) {
        if (re.test(params.body[i])) {
            temp += params.body[i];
            if (i === params.body.length - 1) {
                formmatedBody += temp;
            }
        }
        else {
            if (WORDS.includes(temp.toLowerCase())) {
                formmatedBody += replacer;
            }
            else {
                formmatedBody += temp;
            }
            formmatedBody += params.body[i];
            temp = '';
        }
    }
    respondWithJSON(res, 200, {
        cleanedBody: formmatedBody
    });
}
