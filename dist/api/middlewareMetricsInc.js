import { config } from '../config.js';
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits = config.fileserverHits + 1;
    next();
}
