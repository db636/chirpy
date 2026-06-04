import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from './errorHandler.js';
export async function handlerHitsReset(req, res) {
    console.log('config.api.paltform', config.api.paltform);
    if (config.api.paltform !== "dev") {
        throw new ForbiddenError('Forbidden');
    }
    config.api.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${config.api.fileserverHits}`);
    await deleteAllUsers();
}
